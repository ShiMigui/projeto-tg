import type React from "react";
import styles from "./styles.module.scss";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "tertiary";
};

export default function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return <button {...props} className={`${className} ${styles[variant]}`} />;
}
