const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress");
const resultContainer = document.getElementById("result");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let correctAnswers = [];

async function fetchQuestions() {
    try {
        const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
        const data = await res.json();
        questions = data.results.map((q) => ({
            question: q.question,
            answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correct: q.correct_answer,
        }));
        startQuiz();
    } catch (error) {
        alert("Failed to load questions. Please try again later.");
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = [];
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    nextBtn.classList.add("hidden");
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    let selectedAnswerId;

    currentQuestion.answers.forEach((answer,index) => {
        const li = document.createElement("li");
        li.textContent = answer;
        const itemId = 'answer'+index;
        li.id = itemId
        li.addEventListener("click", () => {
            console.info('s',selectedAnswerId)
            if(selectedAnswerId){
                const oldAnswer =  document.getElementById(selectedAnswerId);
               oldAnswer.style.color = 'black';
               oldAnswer.textContent = oldAnswer.textContent.slice(2)
            }
            const isCorrectAnswer = answer === currentQuestion.correct;
            const randEmojiIndex = Math.floor(Math.random()*4)
            const wrongEmoji = ['🤨','😣','😱','💩']
            const rightEmoji = ['🎉','😇','🥳','🤩']
            const emojis = isCorrectAnswer ? rightEmoji : wrongEmoji;
            li.textContent = emojis[randEmojiIndex]+ ' '+ li.textContent
            li.style.color = isCorrectAnswer ? 'green' : 'red';
            selectedAnswerId = itemId;
            selectAnswer(currentQuestion.question, answer === currentQuestion.correct)
        });
        answersElement.appendChild(li);
    });
}

function resetState() {
    nextBtn.classList.add("hidden");
    answersElement.innerHTML = "";
}

function selectAnswer(question, isCorrect) {
    Array.from(answersElement.children).forEach((child) => child.classList.add("disabled"));

    if (isCorrect && !correctAnswers.includes(question)) {
        correctAnswers.push(question)
    } else {
        correctAnswers = correctAnswers.filter(q=>q!==question)
    }
    nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    questionContainer.classList.add("hidden");
    nextBtn.className = 'hidden'
    resultContainer.classList.remove("hidden");
    scoreElement.textContent = `${correctAnswers.length} / ${questions.length}`;
}

restartBtn.addEventListener("click", fetchQuestions);

// Start the quiz
fetchQuestions();
