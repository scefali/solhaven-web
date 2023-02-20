// components/TextArea.tsx
import { FC } from 'react';

interface TextAreaProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}

const TextArea: FC<TextAreaProps> = ({ label, name, placeholder, required = false, defaultValue }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default TextArea;
