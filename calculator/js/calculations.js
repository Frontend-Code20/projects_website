// This module exports a function to perform calculations based on the provided operator and operands.
export function calculateByOperator(first, second, operator) {
    
    if(!operator || !second){
        return Number.parseFloat(first);
    }

    first = Number.parseFloat(first);
    second = Number.parseFloat(second);
    const operations = {
        "+": add,
        "-": minus,
        "x": multiply,
        "÷": divide,
        "%": module,
        "√": root
    };

    if (operations[operator]) {
        return operations[operator](first, second);
    } else {
        throw new Error("Invalid operator");
    }
}

export function findRoot(value){
    console.log(value);
    if(value.includes("√")){
        const parts = value.split("√");
        console.log(parts);
        if(parts.length === 2 && !isNaN(parts[1])){
            return Math.sqrt(Number.parseFloat(parts[1]));
        }
    }else{
        return value;
    }
}

function add(a, b) {
    return a + b;
}

function minus(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
}

function module(a, b) {
    return a % b;
}

function root(a, b) {
    return a + Math.sqrt(b);
}