import React, { useRef } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import { SunEditorOptions } from 'suneditor/src/options';
import katex from 'katex';
import { formatContent } from '../utils';
import { showErrorToast, showSuccessToast } from './notify';
import { api, AWS_BUCKET_URL } from '../api';

type ApiDataTypes = {
  statusCode: number;
  data?: any;
  message?: string;
  error?: string;
};

interface Props {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  width?: string;
  height?: string;
}

const options: SunEditorOptions = {
  height: '200px',
  buttonList: [
    ['undo', 'redo'],
    ['removeFormat'],
    ['bold', 'underline', 'italic'],
    ['font', 'fontSize', 'formatBlock'], // Adding font family and font size buttons
    ['fontColor', 'hiliteColor'],
    ['align', 'horizontalRule', 'list'],
    ['table', 'link'],
    ['image'],
    ['lineHeight'], // Adding line height button
    ['fullScreen'],
  ],
  katex: katex,
  font: [
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Impact',
    'Georgia',
    'Tahoma',
    'Trebuchet MS',
    'Verdana',
  ],
  fontSize: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30],
  lineHeights: [
    { text: '1', value: 1 },
    { text: '1.15', value: 1.15 },
    { text: '1.5', value: 1.5 },
    { text: '2', value: 2 },
    { text: '2.5', value: 2.5 },
    { text: '3', value: 3 },
  ], // Available line height options
  colorList: [
    '#828282',
    '#FF5400',
    '#676464',
    '#F1F2F4',
    '#FF9B00',
    '#F00',
    '#fa6e30',
    '#000',
    'rgba(255, 153, 0, 0.1)',
    '#FF6600',
    '#0099FF',
    '#74CC6D',
    '#FF9900',
    '#CCCCCC',
  ],
};

const TextEditor: React.FC<Props> = ({
  onChange,
  value,
  placeholder,
  width = '100%',
  height = '500px',
}) => {
  const editor = useRef<SunEditorCore>();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const onChangeEditorValue = (html: string) => {
    html = formatContent(html);
    onChange(encodeURIComponent(html));
  };

  const imageUploadFn = async (file: File, id: any) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const API_URL = `${api.endpoints.upload.image}/${id}`;

      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      const { status: apiStatus, data: apiData } = await api.post(API_URL, formData, headers);

      if (apiStatus === 200) {
        const { statusCode, data } = apiData as unknown as ApiDataTypes;
        if (statusCode === 200) {
          showSuccessToast('Image uploaded successfully.');
          return AWS_BUCKET_URL + '/' + data;
        } else {
          showErrorToast('Image upload failed. Please try again.');
          return null;
        }
      } else {
        showErrorToast('Error uploading the image. Server returned a non-200 status.');
        return null;
      }
    } catch (error) {
      showErrorToast('Network error occurred during image upload.');
      console.error('Upload error:', error);
      return null;
    }
  };

  const imageUploadHandler: any = (files: File[], _info: object, uploadHandler: any) => {
    const file = files[0];
    imageUploadFn(file, 'ohif-viewer-uploads').then(res => {
      if (res) {
        const payload = {
          result: [
            {
              url: res,
              name: file.name,
              size: file.size,
            },
          ],
        };
        uploadHandler(payload);
      } else {
        showErrorToast('Image upload failed. Please try again.');
      }
    });
  };

  return (
    <div className="w-full">
      <SunEditor
        onImageUploadBefore={imageUploadHandler}
        width={width}
        height={height}
        setContents={formatContent(value)}
        defaultValue={formatContent(value)}
        placeholder={placeholder}
        setOptions={options}
        onChange={onChangeEditorValue}
        getSunEditorInstance={getSunEditorInstance}
      />
    </div>
  );
};

export default TextEditor;
