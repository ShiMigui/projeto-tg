import { useState } from "react";
import Button from "../Button";
import Display from "../Display";
import "./styles.scss";

type Operator = "+" | "-" | "X" | "/";

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
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingOperand, setWaitingOperand] = useState(false);

  function showError() {
    setDisplay("Error");
    setPreviousValue(null);
    setOperator(null);
    setWaitingOperand(true);
  }

  function inputDigit(digit: string) {
    if (waitingOperand) {
      setDisplay(digit);
      setWaitingOperand(false);
      return;
    }
    setDisplay((current) => (current === "0" ? digit : current + digit));
  }

  function inputDecimalPoint() {
    if (waitingOperand) {
      setDisplay("0.");
      setWaitingOperand(false);
      return;
    }
    setDisplay((current) => (current.includes(".") ? current : current + "."));
  }

  function chooseOperator(nextOperator: Operator) {
    if (display === "Error") {
      return;
    }

    const currentValue = parseFloat(display);

    if (previousValue !== null && operator !== null && !waitingOperand) {
      const result = calculate(previousValue, currentValue, operator);

      if (Number.isNaN(result)) {
        showError();
        return;
      }

      setPreviousValue(result);
      setDisplay(formatResult(result));
    } else {
      setPreviousValue(currentValue);
    }

    setOperator(nextOperator);
    setWaitingOperand(true);
  }

  function evaluate() {
    if (previousValue === null || operator === null || waitingOperand) {
      return;
    }

    const result = calculate(previousValue, parseFloat(display), operator);

    if (Number.isNaN(result)) {
      showError();
      return;
    }

    setDisplay(formatResult(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingOperand(true);
  }

  return (
    <>
      <main>
        <div id="calculator">
          <Display value={display} />
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
