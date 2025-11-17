import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none transition ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        } ${className}`}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
