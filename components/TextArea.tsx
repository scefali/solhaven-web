// components/TextArea.tsx
import { FC } from "react";

// TODO: dyanmic props
interface TextAreaProps {
  label: string;
  inputProps?: any; // TODO: fix this
}

const TextArea: FC<TextAreaProps> = ({ label, inputProps, ...props }) => {
  console.log("TextArea props: ", inputProps);
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">{label}</label>
      <textarea
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...props}
        {...inputProps}
      />
    </div>
  );
};

export default TextArea;
