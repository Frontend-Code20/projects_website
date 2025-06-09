import { convertFromDecimal } from "./conversions.js"
import { convertToDecimal } from "./conversions.js";
import { convertFromBinary } from "./conversions.js";
import { convertToBinary } from "./conversions.js";

const handlers = {
    "DecimalToBinary": (input) => validateDecimal(input) ? convertFromDecimal(input, 2) : false,
    "DecimalToOctal": (input) => validateDecimal(input) ? convertFromDecimal(input, 8) : false,
    "DecimalToHexadecimal": (input) => validateDecimal(input) ? convertFromDecimal(input, 16) : false,
    "BinaryToDecimal": (input) => validateBinary(input) ? convertToDecimal(input, 2) : false,
    "BinaryToOctal": (input) => validateBinary(input) ? convertFromBinary(input, 8) : false,
    "BinaryToHexadecimal": (input) => validateBinary(input) ? convertFromBinary(input, 16) : false,
    "OctalToBinary": (input) => validateOctal(input) ? convertToBinary(input, 8) : false,
    "OctalToDecimal": (input) => validateOctal(input) ? convertToDecimal(input, 8) : false,
    "OctalToHexadecimal": (input) => validateOctal(input) ? convertFromBinary(convertToBinary(input, 8), 16) : false,
    "HexadecimalToDecimal": (input) => validateHexadecimal(input) ? convertToDecimal(input, 16) : false,
    "HexadecimalToBinary": (input) => validateHexadecimal(input) ? convertToBinary(input, 16) : false,
    "HexadecimalToOctal": (input) => validateHexadecimal(input) ? convertFromBinary(convertToBinary(input, 16), 8) : false,
};

/**
 * This function will return function from object
 * 
 * @param {String} type 
 * @returns 
 */
export function getHandlerFunction(type) {
    return handlers[type] ? handlers[type] : false;  
}

// Validate Binary Number
function validateBinary(input) {

    if (!input) {
        return false;
    }

    const regex = /^[01]+(\.[01]+)?$/
    return regex.test(input);
}

// Validate Octal Number
function validateOctal(input) {

    if (!input) {
        return false;
    }

    const regex = /^[0-7]+(\.[0-7]+)?$/
    return regex.test(input);
}

// Validate Hexadecimal Number
function validateHexadecimal(input) {

    if (!input) {
        return false;
    }

    const regex = /^[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?$/
    return regex.test(input);
}

// Validate Decimal Number
function validateDecimal(input) {

    if (!input) {
        return false;
    }

    const regex = /^[0-9]+(\.[0-9]+)?$/
    return regex.test(input);
}
