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
    const res = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );
    // handle response error
    if (!res.ok) {
      throw new Error("Network response was not ok " + res.statusText);
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

// Shuffle array utility
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
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
  const { question, answers, correct } = currentQuestion;

  // Update question and progress UI
  questionElement.innerHTML = question;
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;
  progressBar.style.width = `${
    ((currentQuestionIndex + 1) / questions.length) * 100
  }%`;

  let selectedAnswerId = null;

  // Helper function to reset the previously selected answer
  function resetPreviousAnswer() {
    if (selectedAnswerId) {
      const oldAnswer = document.getElementById(selectedAnswerId);
      oldAnswer.style.color = "black";
      oldAnswer.textContent = oldAnswer.textContent.slice(2);
    }
  }

  // Helper function to get random emoji
  function getRandomEmoji(isCorrect) {
    const wrongEmojis = ["🤨", "😣", "😱", "💩"];
    const rightEmojis = ["🎉", "😇", "🥳", "🤩"];
    const emojis = isCorrect ? rightEmojis : wrongEmojis;
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  // Render answers
  answers.forEach((answer, index) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.id = `answer${index}`;

    li.addEventListener("click", () => {
      resetPreviousAnswer();

      const isCorrectAnswer = answer === correct;
      li.textContent = `${getRandomEmoji(isCorrectAnswer)} ${answer}`;
      li.style.color = isCorrectAnswer ? "green" : "red";

      selectedAnswerId = li.id;

      selectAnswer(question, isCorrectAnswer);
    });

    answersElement.appendChild(li);
  });
}

function resetState() {
  nextBtn.classList.add("hidden");
  answersElement.innerHTML = "";
}

function selectAnswer(question, isCorrect) {
  Array.from(answersElement.children).forEach((child) =>
    child.classList.add("disabled")
  );

  if (isCorrect && !correctAnswers.includes(question)) {
    correctAnswers.push(question);
  } else {
    correctAnswers = correctAnswers.filter((q) => q !== question);
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
  nextBtn.className = "hidden";
  resultContainer.classList.remove("hidden");
  scoreElement.textContent = `${correctAnswers.length} / ${questions.length}`;
}

restartBtn.addEventListener("click", fetchQuestions);

// Start the quiz
fetchQuestions();
