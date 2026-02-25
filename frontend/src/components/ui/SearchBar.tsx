'use client';

import { useState } from 'react';

type SearchBarProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSubmit,
  placeholder = '検索',
  className = '',
}: SearchBarProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const updateValue = (v: string) => {
    if (!isControlled) setUncontrolledValue(v);
    onChange?.(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => updateValue(e.target.value)}
          aria-label={placeholder}
        />
        <button type="submit" className="btn btn-outline-secondary">
          検索
        </button>
      </div>
    </form>
  );
}
