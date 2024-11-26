import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { FormikErrors, FormikTouched } from 'formik';
import Colors from './Colors';
import { isStr } from '../utils';
import classNames from 'classnames';

interface OwnProps {
  label: string;
  value: any;
  width: number;
  setValue: (val: any) => void;
  options: { label: string; value: any; color: string }[];
  errorText?: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined;
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  theme?: 'dark' | 'light';
}

type Props = OwnProps;

const LabelSelectBox: React.FC<Props> = ({
  label,
  value,
  width,
  setValue,
  options,
  errorText,
  theme = 'light',
}) => {
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
        width: `${width}px`,
        backgroundColor: Colors.white,
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
    label: '',
    color: 'black',
  });

  useEffect(() => {
    const item = options.find(item => item.value === value);
    if (item !== undefined && item !== null) {
      setSelected(item);
    }
  }, [options, value]);
  return (
    <div className="flex flex-col">
      <h4
        className={classNames(
          'mb-[6px] text-base font-normal text-black',
          theme === 'dark' ? 'text-white' : 'text-black'
        )}
      >
        {label}
      </h4>
      <div>
        <Select
          value={selected}
          styles={selectStyles}
          onChange={item => setValue(item)}
          options={options}
          className="bg-white text-base font-normal text-black"
        />
      </div>
      {isStr(errorText) && <span className="text-xs text-red-600">{String(errorText)}</span>}
    </div>
  );
};

export default LabelSelectBox;
