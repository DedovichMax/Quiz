(function () {
    const AnswersResult = {
        Aquiz: null,
        correctAnswers: [],
        userAnswers: [],
        init() {
            const url = new URL(location.href);
            const ansResult = url.searchParams.get('id');
            const userAnswersParam = url.searchParams.get('answers');

            if (userAnswersParam) {
                this.userAnswers = userAnswersParam.split(',').map(Number);
            }

            if (ansResult) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + ansResult, false);
                xhr.send();

                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.Aquiz = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = 'index.html';
                    }

                    this.loadCorrectAnswers(ansResult);
                    this.displayResults();
                    this.updateQuizTitle(); // Добавляем обновление названия теста
                } else {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }
        },

        loadCorrectAnswers(testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + testId, false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.correctAnswers = JSON.parse(xhr.responseText);
                } catch (e) {
                    console.error('Error parsing correct answers:', e);
                }
            }
        },

        updateQuizTitle() {
            if (this.Aquiz && this.Aquiz.name) {
                const quizTitleElement = document.querySelector('.answers-text-test span');
                if (quizTitleElement) {
                    quizTitleElement.textContent = this.Aquiz.name;
                }
            }
        },

        displayResults() {
            if (!this.Aquiz || !this.Aquiz.questions) return;

            const optionsContainer = document.getElementById('options');
            if (!optionsContainer) return;

            optionsContainer.innerHTML = '';

            this.Aquiz.questions.forEach((question, questionIndex) => {
                const questionContainer = document.createElement('div');
                questionContainer.className = 'answers-results';

                const questionTitle = document.createElement('div');
                questionTitle.className = 'answer-result';
                questionTitle.innerHTML = `<span>Вопрос ${questionIndex + 1}:</span> ${question.question}`;

                const optionsWrapper = document.createElement('div');
                optionsWrapper.className = 'answers-options';

                question.answers.forEach((answer) => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'answer-option';

                    const inputId = `answer-${question.id}-${answer.id}`;

                    const inputElement = document.createElement('input');
                    inputElement.type = 'radio';
                    inputElement.id = inputId;
                    inputElement.name = `question-${question.id}`;
                    inputElement.disabled = true;

                    const labelElement = document.createElement('label');
                    labelElement.htmlFor = inputId;
                    labelElement.textContent = answer.answer;

                    const isCorrect = this.correctAnswers[questionIndex] === answer.id;
                    const isUserChoice = this.userAnswers[questionIndex] === answer.id;

                    if (isCorrect) {
                        optionElement.classList.add('correct');
                        inputElement.checked = true;
                    } else if (isUserChoice && !isCorrect) {
                        optionElement.classList.add('incorrect');
                        inputElement.checked = true;
                    }

                    optionElement.appendChild(inputElement);
                    optionElement.appendChild(labelElement);
                    optionsWrapper.appendChild(optionElement);
                });

                questionContainer.appendChild(questionTitle);
                questionContainer.appendChild(optionsWrapper);
                optionsContainer.appendChild(questionContainer);
            });
        }
    };

    AnswersResult.init();
})();