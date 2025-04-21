class QuizApp {
  constructor() {
    this.currentCourse = '';
    this.currentIndex = 0;
    this.score = 0;
    this.courseSelect = document.getElementById('courseSelect');
    this.quizEl = document.getElementById('quiz');
    this.questionContainer = document.getElementById('questionContainer');
    this.nextBtn = document.getElementById('nextBtn');

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.courseSelect.addEventListener('change', () => this.handleCourseChange());
    this.nextBtn.addEventListener('click', () => this.handleNextQuestion());
  }

  handleCourseChange() {
    this.currentCourse = this.courseSelect.value;
    this.currentIndex = 0;
    this.score = 0;
    
    if (this.currentCourse) {
      this.quizEl.style.display = '';
      this.nextBtn.style.display = 'none';
      this.showQuestion();
    } else {
      this.quizEl.style.display = 'none';
    }
  }

  handleNextQuestion() {
    this.currentIndex++;
    this.nextBtn.disabled = true;
    
    if (this.currentIndex < courses[this.currentCourse].length) {
      this.showQuestion();
    } else {
      this.showResults();
    }
  }

  showQuestion() {
    const question = courses[this.currentCourse][this.currentIndex];
    const progress = `(${this.currentIndex + 1}/${courses[this.currentCourse].length})`;
    
    this.questionContainer.innerHTML = `
      <div class="question">
        <strong>Question ${this.currentIndex + 1} ${progress}:</strong> 
        ${question.question}
      </div>
    `;

    const ul = document.createElement('ul');
    ul.className = 'options';
    
    question.options.forEach((option, index) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = option;
      button.addEventListener('click', () => this.handleAnswer(index));
      li.appendChild(button);
      ul.appendChild(li);
    });

    this.questionContainer.appendChild(ul);
    this.nextBtn.style.display = 'none';
  }

  handleAnswer(selected) {
    const question = courses[this.currentCourse][this.currentIndex];
    const buttons = this.questionContainer.querySelectorAll('.options button');
    
    buttons.forEach(button => {
      button.disabled = true;
    });

    const isCorrect = selected === question.answer;
    if (isCorrect) this.score++;

    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect 
      ? 'Correct!' 
      : `Incorrect. The correct answer is: ${question.options[question.answer]}`;
    
    this.questionContainer.appendChild(feedback);
    this.nextBtn.disabled = false;
    this.nextBtn.style.display = '';
  }

  showResults() {
    const percentage = (this.score / courses[this.currentCourse].length) * 100;
    const message = this.getResultMessage(percentage);
    
    this.questionContainer.innerHTML = `
      <h2>Quiz Complete!</h2>
      <div class="results">
        <p>Your score: ${this.score}/${courses[this.currentCourse].length} (${percentage.toFixed(1)}%)</p>
        <p>${message}</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    `;
    this.nextBtn.style.display = 'none';
  }

  getResultMessage(percentage) {
    if (percentage >= 90) return "Excellent! You've mastered this subject!";
    if (percentage >= 70) return "Good job! You have a solid understanding.";
    if (percentage >= 50) return "You passed! But there's room for improvement.";
    return "Keep studying! You'll do better next time.";
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
}); 