import { useEffect, useState } from "react";

export default function SearchBar({
  className,
  onChange = () => {},
}: {
  className?: string;
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <input
      onChange={(e) => setValue(e.target.value)}
      value={value}
      type="text"
      placeholder="Enter Your Word"
      className={`bg-white py-5 text-body w-full shadow-xl shadow-accent/5 px-8 rounded-full ${className} outline-none focus:border-[2px] border-accent`}
    />
  );
}
