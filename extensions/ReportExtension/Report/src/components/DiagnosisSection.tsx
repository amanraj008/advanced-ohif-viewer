import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { ReportAnalysisTypes } from '../types/ReportAnalysisTypes';
import TextEditor from './TextEditor';
import { formatContent } from '../utils';

interface OwnProps {
  sectionName: string;
  value: keyof ReportAnalysisTypes;
  dataName: string;
  isEditEnabled: boolean;
  onChangeValue: (dataName: string, diagnosisText: string) => void;
}

type Props = OwnProps;

const DiagnosisSection: React.FC<Props> = ({ ...props }) => {
  const [isEdit, setIsEdit] = useState(true);

  const onChangeValue = (encodedHtml: string) => {
    props.onChangeValue(props.dataName, encodedHtml);
  };

  return (
    <div>
      <div className="flex items-center justify-between text-black">
        <strong>{props.sectionName}</strong>
        <div>
          {props.isEditEnabled && !isEdit && (
            <MdEdit className="fill-green-600" size={20} onClick={() => setIsEdit(true)} />
          )}
          {props.isEditEnabled && isEdit && (
            <FaEye className="fill-blue-600" size={20} onClick={() => setIsEdit(false)} />
          )}
        </div>
      </div>

      {isEdit && props.isEditEnabled ? (
        <div>
          <br />
          <TextEditor value={props.value} onChange={onChangeValue} />
        </div>
      ) : (
        <div
          className="text-black"
          dangerouslySetInnerHTML={{ __html: formatContent(props.value) }}
        />
      )}
      <br />
    </div>
  );
};

export default DiagnosisSection;
