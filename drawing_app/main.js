const canvas = document.getElementById('canvas');

// Menu icon and menu for the drawing tools
const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementById('menu');
const customCursor = document.getElementById('custom-cursor');
const canvasContainer = document.getElementById('canvas-container');

// These controls are used to change the brush size, color, and other settings
const toolControls = {
    undo: document.getElementById('undo'),
    redo: document.getElementById('redo'),
    brush: document.getElementById('brush'),
    eraser: document.getElementById('eraser'),
    brushColor: document.getElementById('brush-color'),
    brushSize: document.getElementById('brush-size'),
    saveImage: document.getElementById('save-image-btn'),
    createNew: document.getElementById('create-new-btn'),
    designName: document.getElementById('design-name'),
}

const ctx = canvas.getContext('2d');
let drawing = false;
let selectedCursor = 'brush';
let cursorSize = 5;
let cursorColor = '#000'
let cursorType = '<i class="fas fa-paint-brush"></i>';
let undoStack = [];
let redoStack = [];

window.addEventListener('DOMContentLoaded', () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);
    ctx.fillStyle = '#fff'; // Set the canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mouseenter', moveCustomCursor);
window.addEventListener('focus', moveCustomCursor);

// Mouse events for desktop
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawOnMouseMove);
canvas.addEventListener('mouseup', stopDrawing);

// Touch events for mobile devices
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    startDrawing(e.touches[0]); // Use the first touch point
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    drawOnMouseMove(e.touches[0]); // Use the first touch point
});
canvas.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    stopDrawing();
});

// Custom cursor events
canvas.addEventListener('mouseleave', () => {
    stopDrawing();
    customCursor.style.display = 'none';
});

// Menu icon click event to toggle the menu visibility
menuIcon.addEventListener('click', () => {
    menu.classList.toggle('show');
});

// Tool controls event listeners
toolControls.brushSize.addEventListener('change', (e) => {
    cursorSize = Number.parseInt(e.target.value);
});

// Brush color change event
toolControls.brushColor.addEventListener('change', (e) => {
    cursorColor = e.target.value;
});

// Brush and eraser tool selection
toolControls.brush.addEventListener('click', () => {
    selectedCursor = 'brush';
    cursorColor = toolControls.brushColor.value;
    toolControls.brush.classList.add('active');
    toolControls.eraser.classList.remove('active');
    cursorType = '<i class="fas fa-paint-brush"></i>';
});

// Eraser tool selection
toolControls.eraser.addEventListener('click', () => {
    selectedCursor = 'eraser';
    cursorColor = '#fff'; 
    toolControls.eraser.classList.add('active');
    toolControls.brush.classList.remove('active');
    cursorType = '<i class="fas fa-eraser"></i>';
});

// Update the custom cursor based on the selected tool
toolControls.undo.addEventListener('click', () => {
    if (undoStack.length > 0) {
        const lastStep = undoStack.pop();
        redoStack.push(lastStep);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = lastStep;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        }
    }
});

// Redo functionality
toolControls.redo.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const lastStep = redoStack.pop();
        undoStack.push(lastStep);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = lastStep;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        }
    }
});

// Save the current canvas as an image
toolControls.saveImage.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${toolControls.designName.value}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

// Create a new canvas design
toolControls.createNew.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    toolControls.designName.value = 'Untitled';
    toolControls.brushColor.value = '#000';
    toolControls.brushSize.value = 5;
    cursorSize = 5
    cursorColor = '#000'
    selectedCursor = 'brush';
    undoStack = [];
    redoStack = [];
});

function getMousePosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startDrawing(e) {
    drawing = true;
    const { x, y } = getMousePosition(canvas, e);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function drawOnMouseMove(e) {
    if (drawing) {
        const { x, y } = getMousePosition(canvas, e);
        ctx.lineTo(x, y);
        ctx.lineWidth = cursorSize;
        ctx.strokeStyle = cursorColor;
        ctx.stroke();
    }
    const { x, y } = getMousePosition(canvas, e);
    customCursor.style.left = `${x}px`;
    customCursor.style.top = `${y}px`;
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
    const canvasStep = canvas.toDataURL();
    if (undoStack.length < 5 && canvasStep) {
        undoStack.push(canvasStep);
    } else {
        undoStack.shift();
        undoStack.push(canvasStep);
    }
    redoStack = []; 
}

function moveCustomCursor(e) {
    const { x, y } = getMousePosition(canvas, e);
    customCursor.innerHTML = cursorType;
    customCursor.style.left = `${x}px`;
    customCursor.style.top = `${y}px`;
    customCursor.style.display = 'block';
}