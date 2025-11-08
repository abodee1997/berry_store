import * as React from "react";
export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border bg-white ${className}`} {...props} />;
}
export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-5 py-4 border-b ${className}`} {...props} />;
}
export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`text-lg font-bold ${className}`} {...props} />;
}
export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-5 py-4 ${className}`} {...props} />;
}
