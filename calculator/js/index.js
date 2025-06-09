import { calculateByOperator } from "./calculations.js";

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

const deleteBtn = document.getElementById('delete');
const addMinus = document.getElementById('add-minus');
const grandTotalBtn = document.getElementById('grand-total');

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

const operators = ["+", "-", "x", "÷", "%"];

let firstNumber = null;
let totalCount = 0;
let operator = null;


Object.values(buttonInputs).forEach(buttonInput => {
    const buttonValue = buttonInput.dataset.bsValue
    if (operators.includes(buttonValue)) {
        buttonInput.addEventListener('click', () => {
            if (!firstNumber) {
                firstNumber = inputField.value
                inputField.value = ""
                operator = buttonValue;
                totalCountBox.innerHTML = firstNumber + buttonValue
                inputField.focus();
            } {
                totalCount = calculateByOperator(firstNumber, inputField.value, operator)
            }
        });
    } else {
        buttonInput.addEventListener('click', () => {
            inputField.value = inputField.value + buttonValue;
            inputField.focus();
        });
    }
});

clear.addEventListener('click', () => {

    inputField.value = "";
    totalCountBox.innerHTML = "";
    window.localStorage.clear();
    inputField.focus();

});

offBtn.addEventListener('click', () => {

    inputField.value = ""
    inputField.disabled = true;
    inputField.placeholder = "";
    totalCountBox.innerHTML = "";

});

onBtn.addEventListener('click', () => {

    inputField.disabled = false;
    inputField.placeholder = "0";
    inputField.focus();

});

equalButton.addEventListener('click', () => {

    if (firstNumber) {

        const previousGT = Number.parseFloat(window.localStorage.getItem('grandTotal')) || 0;

        totalCount = calculateByOperator(firstNumber, inputField.value, operator);

        totalCountBox.innerHTML += inputField.value + " = " + totalCount;
        inputField.value = totalCount;
        
        window.localStorage.setItem('grandTotal', previousGT + Number.parseFloat(totalCount));
        firstNumber = null;
        console.log(previousGT, totalCount);
        
    }
    inputField.focus();

});

mRCBtn.addEventListener('click', () => {

    const MRCValue = window.localStorage.getItem('MRCValue');
    inputField.value = MRCValue === null ? 0 : MRCValue;
    inputField.focus();

});

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

    inputField.focus();

});

mMinusBtn.addEventListener('click', () => {

    const value = inputField.value.trim();
    const previousValue = Number.parseFloat(window.localStorage.getItem('MRCValue'));
    if (!isNaN(value)) {
        window.localStorage.setItem('MRCValue', previousValue - value);
    }
    inputField.focus();

});

mClearBtn.addEventListener('click', () => {
    window.localStorage.clear();
    inputField.focus();
});

deleteBtn.addEventListener('click', () => {

    const start = inputField.selectionStart;
    const end = inputField.selectionEnd;
    const value = inputField.value;

    if (start === null || start === 0) return;

    inputField.value = value.slice(0, start - 1) + value.slice(end);

    inputField.selectionStart = inputField.selectionEnd = start - 1;

    inputField.focus();

});

addMinus.addEventListener('click', () => {
    let value = inputField.value;

    if (value.startsWith('-')) {
        inputField.value = value.slice(1);
    } else if (value !== '') {
        inputField.value = '-' + value;
    }

    inputField.focus();
});

grandTotalBtn.addEventListener('click', () => {

    const grantTotal = window.localStorage.getItem('grandTotal');
    grantTotal ? inputField.value = grantTotal : inputField.value = 0;
    totalCountBox.innerHTML = ""
    inputField.focus();

});