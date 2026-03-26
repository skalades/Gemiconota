'use client'

import React, { useState, useEffect } from 'react';

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: any;
}

export default function CurrencyInput({ defaultValue, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (defaultValue !== undefined) {
      setDisplayValue(formatValue(defaultValue.toString()));
    }
  }, [defaultValue]);

  const formatValue = (val: string) => {
    // Remove non-digits
    const number = val.replace(/\D/g, "");
    if (!number) return "";
    // Format with dots
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formatted = formatValue(rawValue);
    setDisplayValue(formatted);
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
        Rp
      </div>
      <input
        {...props}
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={`pl-12 ${props.className || ""}`}
        placeholder={props.placeholder || "0"}
      />
    </div>
  );
}
