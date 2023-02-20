// components/Input.tsx
import { FC } from 'react';

interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  required?: boolean;
  defaultValue?: string;
}

const Input: FC<InputProps> = ({ label, name, placeholder, type = 'text', required = false, defaultValue }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default Input;
