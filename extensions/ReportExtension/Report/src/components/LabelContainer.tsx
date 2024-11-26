import classNames from 'classnames';
import React from 'react';
import { FunctionComponent } from 'react';

interface LabelContainerProps {
  label: string;
  children: React.ReactNode;
  bold?: boolean;
  style?: React.CSSProperties;
}

const LabelContainer: FunctionComponent<LabelContainerProps> = ({
  label,
  children,
  bold,
  style,
}) => {
  return (
    <div className="flex flex-col gap-y-[6px]">
      <h3
        style={style}
        className={classNames('text-base font-normal text-black', bold && 'font-bold')}
      >
        {label}
      </h3>
      <div>{children}</div>
    </div>
  );
};

export default LabelContainer;
