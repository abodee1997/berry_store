import * as React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" };
export function Button({ className = "", variant = "default", ...props }: Props) {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border transition focus:outline-none focus:ring-2 rounded-2xl";
  const styles = variant === "outline" ? "bg-white border-slate-200 hover:bg-slate-50" : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
