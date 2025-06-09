
/**
 * This function is used to show error in html element
 * This function will set visiblity to 'visible' 
 * 
 * @param {HTMLElement} element 
 * @param {string} message 
 * @returns 
 */
export function DisplayError(element, message) {

    if (!element || !message) {
        return false;
    }

    element.innerHTML = message;
    element.style.visibility = 'visible';

}