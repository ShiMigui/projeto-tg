import type React from "react";
import "./styles.scss";

type DisplayProps = {
  value: string;
};

export default function Display({ value }: DisplayProps): React.ReactElement {
  return <div className="display">{value}</div>;
}
