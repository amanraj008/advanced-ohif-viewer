import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';

interface OwnProps {
  label: string;
  value: any;
  setValue: (params: any) => void;
  options: any[];
}

type Props = OwnProps;

const CustomSelectBox: React.FC<Props> = ({ label, value, setValue, options }) => {
  const selectStyles: StylesConfig<{ label: string; value: string; color: string }, true> = {
    option: baseStyles => {
      return {
        ...baseStyles,
        color: 'black',
      };
    },
    container: baseStyles => {
      return {
        ...baseStyles,
        width: '100%',
        backgroundColor: 'white',
      };
    },
    singleValue: baseStyle => {
      return {
        ...baseStyle,
        paddingLeft: '10px',
        paddingRight: '10px',
      };
    },
  };

  const [selected, setSelected] = useState({
    value: '',
    label: label,
    color: 'black',
  });

  useEffect(() => {
    const item = options.find(item => item.value === value);
    if (item !== undefined && item !== null) {
      setSelected(item);
    } else {
      setSelected({ color: '', label: label, value: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, value]);
  return (
    <Select
      value={selected}
      styles={selectStyles}
      onChange={item => setValue(item)}
      options={options}
      className="bg-white text-base font-normal text-black"
      placeholder={label}
    />
  );
};

export default CustomSelectBox;
