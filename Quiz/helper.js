import { questions } from "./questions.js"

/**
 * This function will return question based on question number from questions array
 * 
 * @param {Number} questionNumber 
 * @returns {Object}
 */

export function getQuestion(questionNumber) {
    if (questions) {
        return questions[questionNumber];
    }
}

/**
 * This function is used to display options and question
 * 
 * @param {HTMLCollection} options 
 * @param {HTMLElement} question 
 * @param {Object} questionInfo
 * @returns {boolean}
 */

export function setQuestion(options, question, questionInfo) {

    if (!question || !options || !questionInfo) {
        return false
    }


    question.innerHTML = questionInfo?.question;
    options[0].innerHTML = questionInfo?.option1;
    options[1].innerHTML = questionInfo?.option2;
    options[2].innerHTML = questionInfo?.option3;
    options[3].innerHTML = questionInfo?.option4;

    return true;
}

/**
 * This function is used to highlight the selected option
 * This fuction will also return the selected option number
 * 
 * @param {HTMLAllCollection} options 
 * @param {Number} selectedOptionIndex 
 * @returns {Number}
 */

export function selectOption(options, selectedOptionIndex) {

    if (!options) {
        return false;

    }

    Object.values(options).forEach((option, idx) => {
        if (idx === selectedOptionIndex) {
            option.style.backgroundColor = 'rgba(20, 136, 103, 0.2)';
            option.style.outline = '1px solid rgba(20, 136, 103, 1)';
        } else {
            option.style.backgroundColor = 'aliceblue';
            option.style.outline = 'none';
        }
    });

    return selectedOptionIndex + 1;
}

/**
 * This function will deselect options; 
 * @param {HTMLAllCollection} options 
 */

export function deselectOption(options) {
    Object.values(options).forEach((option) => {
        option.style.backgroundColor = 'aliceblue';
        option.style.outline = 'none';
        option.style.color = '#000';
    })
};

/**
 * This is will check for anwser and return true if correct else false
 * 
 * @param {Number} answer 
 * @param {Number} selectedAns 
 * @returns {boolean}
 */

export function checkAnswer(answer, selectedAns) {

    if (!answer || !selectedAns) {
        return false;
    }

    return answer === selectedAns ? true : false
}

/**
 * This function will show answer. This will highlight correct answer will green color and 
 * wrong with red color.
 * 
 * @param {HTMLAllCollection} options 
 * @param {Number} anwser 
 * @param {Number} selectedAns 
 * @returns {boolean}
 */

export function showAnswer(options, anwser, selectedAns) {

    if (!options || !anwser || !selectedAns) {
        return false;
    }

    const result = checkAnswer(anwser, selectedAns);

    if (result) {
        options[anwser - 1].style.backgroundColor = "green";
        options[anwser - 1].style.color = "#fff";
        return true;
    } else {
        options[anwser - 1].style.backgroundColor = "green";
        options[anwser - 1].style.color = "#fff";
        options[selectedAns - 1].style.backgroundColor = "red";
        options[selectedAns - 1].style.color = "#fff";
        return false;
    }
}