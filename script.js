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

async function fetchQuestions() {
  try {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );
    // add error handling for response status
    if (!res.ok) {
      throw new Error(`Failed to fetch questions. Status: ${res.status}`);
    }

    const data = await res.json();
    questions = data.results.map((q) => ({
      question: q.question,
      answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      correct: q.correct_answer,
    }));
    startQuiz();
  } catch (error) {
    alert("Failed to load questions. Please try again later.");
  }
}

// Break out and shuffle the answers for better readability
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultContainer.classList.add("hidden");
  questionContainer.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = currentQuestion.question;
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;
  progressBar.style.width = `${
    ((currentQuestionIndex + 1) / questions.length) * 100
  }%`;

  currentQuestion.answers.forEach((answer) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.addEventListener("click", () =>
      selectAnswer(li, answer === currentQuestion.correct)
    );
    answersElement.appendChild(li);
  });
}

function resetState() {
  nextBtn.classList.add("hidden");
  answersElement.innerHTML = "";
}

function selectAnswer(selectedElement, isCorrect) {
  Array.from(answersElement.children).forEach((child) =>
    child.classList.add("disabled")
  );
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");

  if (isCorrect) score++;
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
  resultContainer.classList.remove("hidden");
  scoreElement.textContent = `${score} / ${questions.length}`;
}

restartBtn.addEventListener("click", fetchQuestions);

// Start the quiz
fetchQuestions();
