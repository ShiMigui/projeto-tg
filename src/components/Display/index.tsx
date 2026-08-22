import type React from "react";
import "./styles.scss";

type DisplayProps = {
  value: string;
  operation?: string;
};

export default function Display({
  value,
  operation,
}: DisplayProps): React.ReactElement {
  return (
    <div className="display">
      {operation !== undefined && <span className="operation">{operation}</span>}
      <span className="value">{value}</span>
    </div>
  );
}
