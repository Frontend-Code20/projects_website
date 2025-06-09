import state from "./globalState.js";
import { DisplayError } from "./helper.js";

let selectOneError = document.getElementById("selectOneError");
let selectTwoError = document.getElementById("selectTwoError");
let fromtext = document.getElementById("from");
let totext = document.getElementById("to");

export function handleFirstSelect(e) {
    state.setFirstSelectType(e.target.value);
    fromtext.innerHTML = `From ${e.target.value}`
    const secondConversionType = state.getSecondSelectType();
    if (e.target.value === secondConversionType) {
        DisplayError(selectOneError, `The selected types are both ${e.target.value.toLocaleLowerCase()}. Please select different types.`)
    } else {
        selectOneError.style.visibility = 'hidden';
        selectTwoError.style.visibility = 'hidden';
    }
}

export function handleSecondSelect(e) {
    state.setSecondSelectType(e.target.value);
    totext.innerHTML = `To ${e.target.value}`
    const firstConversionType = state.getFirstSelectType();
    if (e.target.value === firstConversionType) {
        DisplayError(selectTwoError, `The selected types are both ${e.target.value.toLocaleLowerCase()}. Please select different types`)
    } else {
        selectOneError.style.visibility = 'hidden';
        selectTwoError.style.visibility = 'hidden';
    }
}