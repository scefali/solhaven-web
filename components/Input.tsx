// components/Input.tsx
import { FC } from 'react';

interface InputProps {
  label: string;
  name: string;
  inputProps: object;
}

const Input: FC<InputProps> = ({ label, name, inputProps, ...props}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...props}
        {...inputProps}
      />
    </div>
  );
};

export default Input;
