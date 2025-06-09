import { DisplayError } from "./helper.js";
import state from "./globalState.js";
import { handleFirstSelect, handleSecondSelect } from "./controllers.js";
import { getHandlerFunction } from "./handlers.js";

// Access select elements by ID's 
const select1 = document.getElementById('select1');
const select2 = document.getElementById('select2');
const selectOneError = document.getElementById("selectOneError");
const selectTwoError = document.getElementById("selectTwoError");

const numberInput = document.getElementById("number-input");
const inputError = document.getElementById('inputError');

const answerBox = document.getElementById("answerBox");
const convert = document.getElementById("convert");
const clear = document.getElementById("clear");
const result_text = document.getElementById("result_text");

const menuIcon = document.getElementById('menu-icon');
const menuWrapper = document.getElementById('menu-wrapper');

// Add event listeners to select to get value on change.
select1?.addEventListener('change', handleFirstSelect);
select2?.addEventListener('change', handleSecondSelect);

const menuWidth = menuWrapper?.clientWidth + 50;

window.addEventListener('DOMContentLoaded', () => {

    menuWrapper.style.left = `-${menuWidth}px`
    numberInput.focus();

});

convert.addEventListener("click", () => {

    const firstConversionType = state.getFirstSelectType();
    const secondConversionType = state.getSecondSelectType();

    if (!firstConversionType) {
        DisplayError(selectOneError, "Please select conversion Type")
    } else if (!secondConversionType) {
        DisplayError(selectTwoError, "Please select conversion Type")
    } else if (numberInput.value === '') {
        DisplayError(inputError, `Please enter ${firstConversionType} number.`)
    } else {
        const conversionType = `${firstConversionType}To${secondConversionType}`;
        const convertor = getHandlerFunction(conversionType);
        const inputValue = numberInput.value;
        const result = convertor ? convertor(inputValue) : null;
        if (result) {
            answerBox.innerHTML = result;
            result_text.innerHTML = `Result of ${firstConversionType} To ${secondConversionType}`
            numberInput.focus()
        } else {
            DisplayError(inputError, `Invalid ${firstConversionType} number`)
        }

    }

});

clear.addEventListener("click", () => {

    numberInput.value = "";
    answerBox.innerHTML = "";
    numberInput.focus()

});

numberInput.addEventListener('input', () => {
    inputError.style.visibility = 'hidden';
})

menuIcon.addEventListener('click', () => {
    if (menuWrapper.style.left === '0px') {
        menuWrapper.style.left = `-${menuWidth}px`
        menuIcon.src = '/images/open.png'
    } else {
        menuIcon.src = '/images/close.png'
        menuWrapper.style.left = `0px`
    }
})