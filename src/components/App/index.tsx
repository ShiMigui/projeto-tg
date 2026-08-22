import Button from "../Button";
import "./styles.scss";

function App() {
  return (
    <>
      <main>
        <div id="calculator">
          <Button>7</Button>
          <Button>8</Button>
          <Button>9</Button>
          <Button variant="tertiary">/</Button>
          <Button>4</Button>
          <Button>5</Button>
          <Button>6</Button>
          <Button variant="tertiary">X</Button>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button variant="tertiary">-</Button>
          <Button variant="tertiary">.</Button>
          <Button>0</Button>
          <Button variant="tertiary">+</Button>
          <Button variant="secondary">=</Button>
        </div>
      </main>
    </>
  );
}

export default App;
