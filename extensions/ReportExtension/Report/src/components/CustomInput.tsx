import React from 'react';
interface CustomInputProps {
  value?: string;
  onChange?: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}

const CustomInput: React.FC<CustomInputProps> = ({
  onChange,
  value,
  placeholder = 'Choose file',
  type = 'text',
}) => {
  return (
    <input
      type={type}
      className="w-full rounded-[6px] border border-[#DEE2E6] bg-white px-2 py-[5px] text-base font-normal text-black outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default CustomInput;
