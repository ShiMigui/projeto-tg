import { useState } from "react";
import Button from "../Button";
import Display from "../Display";
import "./styles.scss";

type Operator = "+" | "-" | "X" | "/";

type CalculatorState = {
  display: string;
  previousValue: number | null;
  operator: Operator | null;
  waitingOperand: boolean;
};

const INITIAL_STATE: CalculatorState = {
  display: "0",
  previousValue: null,
  operator: null,
  waitingOperand: false,
};

const ERROR_STATE: CalculatorState = {
  display: "Error",
  previousValue: null,
  operator: null,
  waitingOperand: true,
};

function calculate(a: number, b: number, operator: Operator): number {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "X":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
  }
}

function formatResult(value: number): string {
  return String(Number(value.toPrecision(12)));
}

function App() {
  const [calculator, setCalculator] = useState<CalculatorState>(INITIAL_STATE);
  const { display } = calculator;
  const operation =
    calculator.previousValue !== null && calculator.operator !== null
      ? `${formatResult(calculator.previousValue)} ${calculator.operator}`
      : undefined;

  function inputDigit(digit: string) {
    setCalculator((current) => {
      if (current.waitingOperand) {
        return { ...current, display: digit, waitingOperand: false };
      }
      return {
        ...current,
        display: current.display === "0" ? digit : current.display + digit,
      };
    });
  }

  function inputDecimalPoint() {
    setCalculator((current) => {
      if (current.waitingOperand) {
        return { ...current, display: "0.", waitingOperand: false };
      }
      if (current.display.includes(".")) {
        return current;
      }
      return { ...current, display: current.display + "." };
    });
  }

  function chooseOperator(nextOperator: Operator) {
    setCalculator((current) => {
      if (current.display === "Error") {
        return current;
      }

      const currentValue = parseFloat(current.display);

      if (
        current.previousValue !== null &&
        current.operator !== null &&
        !current.waitingOperand
      ) {
        const result = calculate(
          current.previousValue,
          currentValue,
          current.operator,
        );

        if (Number.isNaN(result)) {
          return ERROR_STATE;
        }

        return {
          display: formatResult(result),
          previousValue: result,
          operator: nextOperator,
          waitingOperand: true,
        };
      }

      return {
        ...current,
        previousValue: currentValue,
        operator: nextOperator,
        waitingOperand: true,
      };
    });
  }

  function evaluate() {
    setCalculator((current) => {
      const { previousValue, operator, waitingOperand } = current;

      if (previousValue === null || operator === null || waitingOperand) {
        return current;
      }

      const result = calculate(previousValue, parseFloat(current.display), operator);

      if (Number.isNaN(result)) {
        return ERROR_STATE;
      }

      return {
        display: formatResult(result),
        previousValue: null,
        operator: null,
        waitingOperand: true,
      };
    });
  }

  return (
    <>
      <main>
        <div id="calculator">
          <Display value={display} operation={operation} />
          <Button onClick={() => inputDigit("7")}>7</Button>
          <Button onClick={() => inputDigit("8")}>8</Button>
          <Button onClick={() => inputDigit("9")}>9</Button>
          <Button variant="tertiary" onClick={() => chooseOperator("/")}>
            /
          </Button>
          <Button onClick={() => inputDigit("4")}>4</Button>
          <Button onClick={() => inputDigit("5")}>5</Button>
          <Button onClick={() => inputDigit("6")}>6</Button>
          <Button variant="tertiary" onClick={() => chooseOperator("X")}>
            X
          </Button>
          <Button onClick={() => inputDigit("1")}>1</Button>
          <Button onClick={() => inputDigit("2")}>2</Button>
          <Button onClick={() => inputDigit("3")}>3</Button>
          <Button variant="tertiary" onClick={() => chooseOperator("-")}>
            -
          </Button>
          <Button variant="tertiary" onClick={inputDecimalPoint}>
            .
          </Button>
          <Button onClick={() => inputDigit("0")}>0</Button>
          <Button variant="tertiary" onClick={() => chooseOperator("+")}>
            +
          </Button>
          <Button variant="secondary" onClick={evaluate}>
            =
          </Button>
        </div>
      </main>
    </>
  );
}

export default App;
