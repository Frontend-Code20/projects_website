import { calculateByOperator, findRoot } from "./calculations.js";

// Get all the buttons and input fields
const equalButton = document.getElementById('equal');
const inputField = document.getElementById('number-input');
const totalCountBox = document.getElementById('total-count');
const clear = document.getElementById('clear');
const offBtn = document.getElementById('off-btn');
const onBtn = document.getElementById('on-btn');

// Memory storage buttons
const mRCBtn = document.getElementById('mrc');
const mMinusBtn = document.getElementById('m-minus');
const mAddBtn = document.getElementById('m-add');
const mClearBtn = document.getElementById('m-clear')

// Other buttons
const deleteBtn = document.getElementById('delete');
const addMinus = document.getElementById('add-minus');
const grandTotalBtn = document.getElementById('grand-total');

// Button inputs 
const buttonInputs = {
    one: document.getElementById('one'),
    two: document.getElementById('two'),
    three: document.getElementById('three'),
    four: document.getElementById('four'),
    five: document.getElementById('five'),
    six: document.getElementById('six'),
    seven: document.getElementById('seven'),
    eight: document.getElementById('eight'),
    nine: document.getElementById('nine'),
    plus: document.getElementById('plus'),
    minus: document.getElementById('minus'),
    multiply: document.getElementById('multiply'),
    divide: document.getElementById('divide'),
    zero: document.getElementById('zero'),
    module: document.getElementById('module'),
    root: document.getElementById('root'),
    dot: document.getElementById('dot'),
}

// Define the operators
const operators = ["+", "-", "x", "÷", "%"];

// Initialize variables
let firstNumber = null;
let totalCount = 0;
let operator = null;

// Add event listeners to the buttons
Object.values(buttonInputs).forEach(buttonInput => {
    const buttonValue = buttonInput.dataset.bsValue
    if (operators.includes(buttonValue)) {
        buttonInput.addEventListener('click', () => {
            if (!firstNumber) {
                firstNumber = findRoot(inputField.value);
                operator = buttonValue;
                totalCountBox.innerHTML = inputField.value + buttonValue
                inputField.value = ""
            } {
                totalCount = calculateByOperator(firstNumber, inputField.value, operator)
            }
        });
    } else {
        buttonInput.addEventListener('click', () => {
            inputField.value = inputField.value + buttonValue;
        });
    }
    window.innerWidth > 768 ? inputField.focus() : inputField.blur();
});

// Clear button functionality
clear.addEventListener('click', () => {

    inputField.value = "";
    totalCountBox.innerHTML = "";
    window.localStorage.clear();
    window.innerWidth > 768 ? inputField.focus() : inputField.blur();

});

// Off and On button functionality
offBtn.addEventListener('click', () => {

    inputField.value = ""
    inputField.disabled = true;
    inputField.placeholder = "";
    totalCountBox.innerHTML = "";

});

onBtn.addEventListener('click', () => {

    inputField.disabled = false;
    inputField.placeholder = "0";
    window.innerWidth > 768 ? inputField.focus() : inputField.blur();
    
});

// Equal button functionality
equalButton.addEventListener('click', () => {

    if (firstNumber) {

        const previousGT = Number.parseFloat(window.localStorage.getItem('grandTotal')) || 0;

        totalCount = calculateByOperator(firstNumber, findRoot(inputField.value) , operator);

        totalCountBox.innerHTML += inputField.value + " = " + totalCount.toFixed(2);
        inputField.value = totalCount.toFixed(5);
        
        window.localStorage.setItem('grandTotal', previousGT + Number.parseFloat(totalCount));
        firstNumber = null;
        
    }
    window.innerWidth > 768 ? inputField.focus() : inputField.blur();

});

// Memory buttons functionality
mRCBtn.addEventListener('click', () => {

    const MRCValue = window.localStorage.getItem('MRCValue');
    inputField.value = MRCValue === null ? 0 : MRCValue;
    window.innerWidth > 768 ? inputField.focus() : inputField.blur();


});

// Memory add, minus, and clear buttons functionality
mAddBtn.addEventListener('click', () => {

    const value = inputField.value
    const stored = window.localStorage.getItem('MRCValue');
    const previousValue = parseFloat(stored) || 0;
    const currentValue = parseFloat(value);

    if (!isNaN(currentValue)) {
        const updatedValue = previousValue + currentValue;
        window.localStorage.setItem('MRCValue', updatedValue);
    } else {
    }

    window.innerWidth > 768 ? inputField.focus() : inputField.blur();

});

// Memory minus button functionality
mMinusBtn.addEventListener('click', () => {

    const value = inputField.value.trim();
    const previousValue = Number.parseFloat(window.localStorage.getItem('MRCValue'));
    if (!isNaN(value)) {
        window.localStorage.setItem('MRCValue', previousValue - value);
    }
    window.innerWidth > 768 ? inputField.focus() : inputField.blur();

});

// Memory clear button functionality
mClearBtn.addEventListener('click', () => {
    window.localStorage.clear();
    window.innerWidth > 768 ? inputField.focus() : inputField.blur();

});

// Delete button functionality
deleteBtn.addEventListener('click', () => {

    const start = inputField.selectionStart;
    const end = inputField.selectionEnd;
    const value = inputField.value;

    if (start === null || start === 0) return;

    inputField.value = value.slice(0, start - 1) + value.slice(end);

    inputField.selectionStart = inputField.selectionEnd = start - 1;

    window.innerWidth > 768 ? inputField.focus() : inputField.blur();

});

// Add or remove minus sign functionality
addMinus.addEventListener('click', () => {
    let value = inputField.value;

    if (value.startsWith('-')) {
        inputField.value = value.slice(1);
    } else if (value !== '') {
        inputField.value = '-' + value;
    }

    window.innerWidth > 768 ? inputField.focus() : inputField.blur();

});

// Grand total button functionality
grandTotalBtn.addEventListener('click', () => {

    const grantTotal = window.localStorage.getItem('grandTotal');
    grantTotal ? inputField.value = grantTotal : inputField.value = 0;
    totalCountBox.innerHTML = ""
    window.innerWidth > 768 ? inputField.focus() : inputField.blur();
});