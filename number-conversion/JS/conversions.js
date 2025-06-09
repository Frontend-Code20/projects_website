/**
 * This function converts Decimal number to Binary, Octal, and Hexadecimal
 * And return a value based on parameters
 * 
 * @param {Number} decimalNumber
* @param {Number} base 
 * @returns 
 */
export function convertFromDecimal(number, base) {

    if (number === null || !base) return null;

    const convertWithoutfraction = (decimal) => {
        let result = '';
        while (decimal >= base) {
            result = hexaBaseFormat(decimal % base) + result;
            decimal = Math.floor(decimal / base);
        }
        return hexaBaseFormat(decimal) + result;
    }

    if (number % 1) {
        let fraction = ''
        let fractionValue = number % 1;
        while (fractionValue !== 0) {
            let reminder = Number.parseInt(fractionValue * base);
            fraction += reminder;
            fractionValue = (fractionValue * base) - reminder;
        }
        
        return convertWithoutfraction(Math.floor(number)) + '.' + (isFinite(fraction) ? fraction.slice(0,5) : fraction);
    } else {
        return convertWithoutfraction(number);
    }
}

/**
 * This function will convert given number to decimal based on 'base' in input. 
 * The supported bases  are 2 for Binary, 8 for Octal, and 16 for hexadecimal.
 * 
 * @param {String} number 
 * @param {Number} base 
 * @returns 
 */

export function convertToDecimal(number, base) {

    if (number === null || !base) return null;

    let result = 0;
    const newNumber = number.replace('.', '');
    let power = getPowerIndex(number);
    
    for (let i = newNumber.length - 1; i >= 0; i--) {
        result += hexaBaseFormat(newNumber[i]) * Math.pow(base, power);
        power++;
    }
    return result;

}

// Binary value of HexaDecimal
const hexToBinary = {
    0: '0000', 1: '0001', 2: '0010', 3: '0011', 4: '0100', 5: '0101',
    6: '0110', 7: '0111', 8: '1000', 9: '1001', A: '1010',
    B: '1011', C: '1100', D: '1101', E: '1110', F: '1111'
};

// Binary value of Octal
const octToBinary = { 0: '000', 1: '001', 2: '010', 3: '011', 4: '100', 5: '101', 6: '110', 7: '111' };


/**
 * This function will convert Octal and Hexadecimal value to Binary
 * 
 * @param {String} value 
 * @param {Number} base 
 * @returns 
 */
export function convertToBinary(value, base) {

    if (value === null || !base) return null;

    const toBinary = (binary) => {
        let result = '';
        for (let index = 0; index < binary.length; index++) {
            result += base === 8 ? octToBinary[binary[index]] : hexToBinary[binary[index].toLocaleUpperCase()];
        }
        return result;
    }

    if (value.includes('.')) {
        const octal = value.slice(0, value.indexOf('.'))
        const fraction = value.slice(value.indexOf('.') + 1 , value.length)
        
        return Number.parseFloat(toBinary(octal)) + '.' + toBinary(fraction)
    }else{
        return toBinary(value);
    }

}

/**
 * This function will convert Binary number to Octal and HexaDecimal
 * 
 * @param {String} binaryNumber 
 * @param {Number} base 
 * @returns 
 */
export function convertFromBinary(binaryNumber, base) {

    if (!binaryNumber === null || !base) return null;

    const FromBinary = (binary, zeroPostion) => {
        const baseMap = base === 8 ? octToBinary : hexToBinary;
        const groupSize = base === 8 ? 3 : 4
        let newBinaryNumber = addZero(binary, groupSize, zeroPostion);

        let result = '';
        for (let index = groupSize; index <= newBinaryNumber.length; index += groupSize) {
            const chunk = newBinaryNumber.slice(index - groupSize, index);
            result += Object.keys(baseMap).find(key => baseMap[key] === chunk);
        }
        return result;
    }

    if (binaryNumber % 1) {
        const binary = binaryNumber.slice(0, binaryNumber.indexOf('.'))
        const fraction = binaryNumber.slice(binaryNumber.indexOf('.')+1 , binaryNumber.length)
        return FromBinary(binary, true) + '.' + FromBinary(fraction, false);
    } else {
        return FromBinary(binaryNumber, true);
    }

}

/**
 * This function add zero to complete groups for hexadecimal and octal conversion.
 * if the third parameter will true, this will add 0 add the biginning else at the end.
 * @param {String} value 
 * @param {Number} parts
 * @param {boolean} postion 
 * @returns 
 */
function addZero(value, parts, postion) {

    if (!value || !parts) {
        return null;
    }

    let newValue = value;
    while (true) {
        if (newValue.length % parts === 0) {
            break;
        } else {
            newValue = postion ? '0' + newValue : newValue + '0';
        }
    }
    return newValue;
}


/**
 * This function will return hexa alphabet base on parameter
 * 
 * @param {Number} hexa
 * @returns 
 */
function hexaBaseFormat(hexa) {
    
    if (!hexa && hexa !== 0) {
        return false;
    }

    const hexaFormat = { 10: "A", 11: "B", 12: "C", 13: "D", 14: "E", 15: "F" }

    if (hexa < 10) {
        return hexa;
    }

    if (isNaN(Number.parseInt(hexa))) {
        console.log('string');
        return Object.keys(hexaFormat).find(key => hexaFormat[key] === hexa.toLocaleUpperCase())
        
    } else {
        return hexaFormat[hexa];
    }
}

function getPowerIndex(value) {
    const pointValue = value.slice(value.indexOf('.') + 1, value.length)
    return value.includes('.') ? - (pointValue.length) : 0;
}