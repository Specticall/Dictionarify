import { MouseEvent, ReactNode } from "react";

const styles = {
  dark: "bg-main text-white px-10 rounded-full py-3 hover:opacity-60 text-body",
  accent:
    "bg-accent text-white px-10 rounded-full py-3 hover:opacity-60 text-body",
  gray: "bg-lighter text-body font-medium px-10 rounded-full py-3 hover:opacity-60 text-main-light",
};

export default function Button({
  children,
  style = "dark",
  onClick = () => {},
  className = "",
}: {
  children: ReactNode;
  style?: keyof typeof styles;
  onClick?: (e: MouseEvent) => void;
  className?: string;
}) {
  const handleClick = (e: MouseEvent) => {
    onClick(e);
  };

  return (
    <button
      className={`${styles[style] || ""} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
