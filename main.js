// create an object to track values
const Calculator = {
    // Display 0
    displayValue: '0',
    // Holds the first operator
    firstOperand: null,
    // checks whether a second operand was input
    waitSecondOperand: false,
    // temp hold an operator
    operator: null
};

// modifies values each time a button is clicked
function Input_Digit(digit) {
    const {displayValue, waitSecondOperand} = Calculator;
    // Checking if waitSecondOperand is true and set displayValue to the key that was clicked
    if (waitSecondOperand === true) {
        Calculator.displayValue = digit;
        Calculator.waitSecondOperand = false;
    } else {
        Calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Decimals
function Input_Decimal(dot) {
    // Safety net for accidental clicks of the decimal button
    if (Calculator.waitSecondOperand === true) return;
    if (!Calculator.displayValue.includes(dot)) {
        Calculator.displayValue += dot;
    }
}

// Operators
function Handle_Operator(Next_Operator) {
    const {firstOperand, displayValue, operator} = Calculator;
    // Converts current number to a stored number in Calculator.firstOperand
    const VALUE_OF_INPUT = parseFloat(displayValue);
    // operator check and updates operator
    if (operator && Calculator.waitSecondOperand) {
        Calculator.operator = Next_Operator;
        return;
    }
    if (firstOperand == null) {
        Calculator.firstOperand = VALUE_OF_INPUT;
    } else if (operator) { // operator check
        const VALUE_NOW = firstOperand || 0;
        let result = PERFORM_CALCULATION[operator](VALUE_NOW, VALUE_OF_INPUT);
        // Add fixed amount of numbers after the decimal
        result = Number(result).toFixed(9);
        // remove 0s
        result = (result *1).toString();
        Calculator.displayValue = parseFloat(result);
        Calculator.firstOperand = parseFloat(result);
    }
    Calculator.waitSecondOperand = true;
    Calculator.operator = Next_Operator;
}
const PERFORM_CALCULATION = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

function Calculator_Reset() {
    Calculator.displayValue = '0';
    Calculator.firstOperand = null;
    Calculator.waitSecondOperand = false;
    Calculator.operator = null;
}
// Updates screen with displayValue
function Update_Display() {
    const DISPLAY = document.querySelector('.calculator-screen');
    DISPLAY.value = Calculator.displayValue;
}
Update_Display();
// monitors button clicks
const KEYS = document.querySelector('.calculator-keys');
KEYS.addEventListener('click', (event) => {
    //
    const {target} = event;
    //button not clicked: exit
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        Handle_Operator(target.value);
        Update_Display();
        return;
    }

    if (target.classList.contains('decimal')) {
        Input_Decimal(target.value);
        Update_Display();
        return;
    }
    // AC clears all numbers
    if (target.classList.contains('all-clear')) {
        Calculator_Reset();
        Update_Display();
        return;
    }

    Input_Digit(target.value);
    Update_Display();
});