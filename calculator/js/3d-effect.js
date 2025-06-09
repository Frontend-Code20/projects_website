
const calculator = document.getElementById('calculator');

let isDragging = false;

calculator.addEventListener('mousedown', () => {
    isDragging = true;
})

calculator.addEventListener('mousemove', () => {
    if(isDragging){
        console.log("Moving");
    }
});

calculator.addEventListener('mouseup', () => {
    isDragging = false;
});
