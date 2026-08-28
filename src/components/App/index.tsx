import { useState } from "react";
import Button from "../Button";
import Display from "../Display";
import "./styles.scss";

const OPERATORS = ["+", "-", "X", "/"] as const;

type Operator = (typeof OPERATORS)[number];

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

function isOperatorToken(token: string): boolean {
  return (OPERATORS as readonly string[]).includes(token);
}

function endsWithOperator(expression: string): boolean {
  return isOperatorToken(expression.trimEnd().split(" ").pop() ?? "");
}

function currentOperand(expression: string): string | null {
  const parts = expression.trimEnd().split(" ");
  const token = parts[parts.length - 1] ?? "";
  if (parts.length > 1 && isOperatorToken(token)) {
    return null;
  }
  return token === "" ? null : token;
}

function parseOperand(operand: string | null): number {
  return operand === null || operand === "-" ? 0 : parseFloat(operand);
}

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

  function allClear() {
    setCalculator(INITIAL_STATE);
  }

  function clearEntry() {
    setCalculator((current) => {
      if (current.display === "Error") {
        return { ...INITIAL_STATE };
      }

      const trimmed = current.display.trimEnd();
      const parts = trimmed.split(" ");
      const last = parts[parts.length - 1];

      if (parts.length > 1 && !isOperatorToken(last)) {
        return {
          ...current,
          display: `${trimmed.slice(0, -(last.length + 1))} `,
          waitingOperand: true,
        };
      }

      return { ...current, display: "0", waitingOperand: false };
    });
  }

  function inputDigit(digit: string) {
    setCalculator((current) => {
      if (!current.waitingOperand) {
        const operand = currentOperand(current.display);

        if (operand === "0") {
          return { ...current, display: `${current.display.slice(0, -1)}${digit}` };
        }

        if (operand === "-0") {
          return { ...current, display: `${current.display.slice(0, -2)}${digit}` };
        }

        return { ...current, display: `${current.display}${digit}` };
      }

      if (endsWithOperator(current.display)) {
        return { ...current, display: `${current.display}${digit}`, waitingOperand: false };
      }

      return { ...current, display: digit, waitingOperand: false };
    });
  }

  function inputDecimalPoint() {
    setCalculator((current) => {
      if (current.waitingOperand && endsWithOperator(current.display)) {
        return { ...current, display: `${current.display}0.`, waitingOperand: false };
      }

      if (current.waitingOperand) {
        return { ...current, display: "0.", waitingOperand: false };
      }

      const operand = currentOperand(current.display) ?? "";

      if (operand === "") {
        return { ...current, display: "0.", waitingOperand: false };
      }

      if (operand.includes(".")) {
        return current;
      }

      if (operand === "-" || operand === "-0") {
        return { ...current, display: `${current.display}0.`, waitingOperand: false };
      }

      return { ...current, display: `${current.display}.`, waitingOperand: false };
    });
  }

  function toggleSign() {
    setCalculator((current) => {
      if (current.display === "Error") {
        return current;
      }

      const operand = currentOperand(current.display);

      if (operand === null) {
        return { ...current, display: `${current.display}-`, waitingOperand: false };
      }

      if (operand.startsWith("-")) {
        const stripped = current.display.slice(0, -operand.length) + operand.slice(1);
        return {
          ...current,
          display: stripped === "" ? "0" : stripped,
          waitingOperand: false,
        };
      }

      return { ...current, display: `${current.display}-`, waitingOperand: false };
    });
  }

  function chooseOperator(nextOperator: Operator) {
    setCalculator((current) => {
      if (current.display === "Error") {
        return current;
      }

      if (current.waitingOperand && endsWithOperator(current.display)) {
        return {
          ...current,
          display: `${current.display.trimEnd().slice(0, -1)}${nextOperator} `,
          operator: nextOperator,
        };
      }

      const operand = parseOperand(currentOperand(current.display));

      if (current.previousValue !== null && current.operator !== null) {
        if (current.waitingOperand) {
          return {
            ...current,
            display: `${current.display} ${nextOperator} `,
            previousValue: parseOperand(current.display),
            operator: nextOperator,
          };
        }

        const result = calculate(current.previousValue, operand, current.operator);

        if (Number.isNaN(result)) {
          return ERROR_STATE;
        }

        return {
          display: `${current.display} ${nextOperator} `,
          previousValue: result,
          operator: nextOperator,
          waitingOperand: true,
        };
      }

      return {
        display: `${current.display} ${nextOperator} `,
        previousValue: operand,
        operator: nextOperator,
        waitingOperand: true,
      };
    });
  }

  function evaluate() {
    setCalculator((current) => {
      if (current.display === "Error") {
        return current;
      }

      const operand = parseOperand(currentOperand(current.display));

      if (current.operator !== null && current.previousValue !== null) {
        const result = calculate(current.previousValue, operand, current.operator);

        if (Number.isNaN(result)) {
          return ERROR_STATE;
        }

        return {
          display: formatResult(result),
          previousValue: null,
          operator: null,
          waitingOperand: true,
        };
      }

      return { ...current, display: formatResult(operand), waitingOperand: true };
    });
  }

  return (
    <>
      <main>
        <div id="calculator">
          <Display value={display} />
          <Button variant="secondary" className="ac" onClick={allClear}>
            AC
          </Button>
          <Button variant="secondary" onClick={clearEntry}>
            C
          </Button>
          <Button variant="tertiary" onClick={toggleSign}>
            +/-
          </Button>
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