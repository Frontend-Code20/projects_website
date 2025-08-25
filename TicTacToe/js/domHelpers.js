
/**
 * This function will loop over the selection button and get there value, which
 * is store in the data-player attribute
 * 
 * @param {*} btns 
 * @param {*} index 
 * @returns 
 */
export function getUserSelectedPlayer(btns = [], index) {
    let player = null;
    btns.forEach((btn, idx) => {
        if (idx === index) {
            btn.classList.add("selected");
            player = btn.getAttribute("data-player");
        } else {
            btn.classList.remove("selected");
        }
    });
    return player;
}
