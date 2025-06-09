// Importing question Array
import { questions } from "./questions.js";

// Importing Helper function
import { getQuestion, setQuestion, selectOption, deselectOption, showAnswer } from "./helper.js";

// Access question and options tags by Ids
const question = document.getElementById('question');
const options = document.getElementsByClassName('option');
const button = document.getElementById('question-btn');
const totalElement = document.getElementById("Total");

// Access DOM Elements to manage question/result sections
const wrapper = document.getElementById("wrapper");
const resultWrapper = document.getElementById("result-wrapper");
const questionWrapper = document.getElementById("question-wrapper");
const Obtained = document.getElementById("Obtained");
const Trybtn = document.getElementById("Trybtn");

// Access Timer Element
const timerElement = document.getElementById("Timer");

// Initialize global variables
let selectedAns = 0;
let correctAns = 0;
let nextQuestion = 1;
let correctAttempts = 0;
let timeLeft = 30;
let timer = null;
const wrapperWidth = wrapper.clientWidth; // Get parent wrapper width to manage layout

// Event listener for DOM content loaded
window.addEventListener('DOMContentLoaded', () => {

    // Initial setup when page is loaded
    setupInitialQuestion();
    setupTotalQuestions();
    startTimer();
    setEventToOptions();

    resultWrapper.style.left = `${wrapperWidth}px`

})

// Event listener for question button click
button?.addEventListener('click', handleButtonClick);

// Event listener for retrying the quiz
Trybtn.addEventListener('click', handleRetry);

function setupInitialQuestion() {
    // Load the first question
    const question1 = getQuestion(0);
    correctAns = question1?.answer;
    setQuestion(options, question, question1);
}

function setupTotalQuestions() {
    // Set the total number of questions
    totalElement.innerHTML = `${nextQuestion} / ${questions.length}`;
}

function startTimer() {
    // Start the timer for question countdown
    timer = setInterval(handleTimer, 1000);
}

function handleButtonClick() {
    if (button.innerHTML === "Submit Answer") {
        handleSubmitAnswer();
    } else if (button.innerHTML === "Next") {
        handleNext();
    } else if (button.innerHTML === "Done") {
        handleDone();
    }
}

function handleSubmitAnswer() {

    if (nextQuestion === questions.length) {
        button.innerHTML = 'Done';  // Show Done button at the last question
    } else {
        button.innerHTML = 'Next';  // Change button to Next for subsequent questions
    }

    // Disable option clicks after submitting answer
    Object.values(options).forEach((option) => {
        option.removeEventListener('click', option.handler);
    });

    button.disabled = false;
    deselectOption(options);

    // Check if the selected answer is correct
    const result = showAnswer(options, correctAns, selectedAns);
    if (result) {
        correctAttempts++;  // Increment correct attempts if answer is correct
    }

    // Stop the timer after submitting the answer
    clearInterval(timer);
    console.log(correctAns, selectedAns, correctAttempts);
}

// Function to handle loading the next question
function handleNext() {
    if (nextQuestion < questions.length) {
        loadNextQuestion();
        resetTimer();
    } else {
        handleDone();
    }
}

function loadNextQuestion() {
    // Load the next question and update UI elements
    totalElement.innerHTML = `${nextQuestion + 1} / ${questions.length}`;
    deselectOption(options);
    const questionInfo = getQuestion(nextQuestion);
    setQuestion(options, question, questionInfo);
    correctAns = questionInfo?.answer
    nextQuestion++;
    button.innerHTML = "Select Option";
    button.disabled = true;
    setEventToOptions();
}

function resetTimer() {
    timeLeft = 30;
    timerElement.innerHTML = 30;
}
function handleTimer() {
    // Handle countdown logic for the timer
    if (timeLeft > 0) {
        timeLeft--;  // Decrement the time left
        timerElement.innerHTML = timeLeft;  // Update the timer display
    } else {
        // If time runs out, go to the next question or end quiz
        if (nextQuestion < questions.length) {
            handleNext();
        } else {
            handleDone();
        }
    }
}

function handleDone() {
    // Hide question section and show result section
    questionWrapper.style.left = `-${wrapperWidth}px`;
    Obtained.innerHTML = `${correctAttempts} / ${questions.length}`;
    resultWrapper.style.left = '0';
}

function setEventToOptions() {
    // Attach event listeners to the answer options
    Object.values(options).forEach((option, idx) => {
        const handler = () => handleSelection(idx);
        option.addEventListener('click', handler);
        option.handler = handler;
    });
}

function handleSelection(index) {
    // Handle user selection of an answer option
    const selected = selectOption(options, index);
    if (selected) {
        button.disabled = false;
        button.innerHTML = "Submit Answer";
        selectedAns = selected;
    }
}

function handleRetry() {
    // Reset the quiz to the beginning for retry
    resetQuiz();
    setupInitialQuestion();
    setupTotalQuestions();
    startTimer();
    setEventToOptions();
    questionWrapper.style.left = '0px'
    resultWrapper.style.left = `${wrapperWidth}px`;  // Hide results section
}

function resetQuiz() {
    // Reset global variables and DOM states for a fresh attempt
    correctAttempts = 0;
    nextQuestion = 1;
    timeLeft = 30;
    timerElement.innerHTML = 30;
    deselectOption(options);
    button.disabled = true;
}