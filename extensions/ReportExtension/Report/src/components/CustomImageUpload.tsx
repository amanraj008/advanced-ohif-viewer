import React, { useRef } from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import { showErrorToast } from './notify';
import { api, AWS_BUCKET_URL } from '../api';
import { isValidUrl } from '../utils';
import classNames from 'classnames';
import { isStr } from '../utils';

interface CustomUploaderWithSelectBoxProps {
  label: string;
  value: string;
  width?: number | string;
  setValue: (filepath: string) => void;
  errorText?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  bold?: boolean;
}

const CustomImageUpload: React.FC<CustomUploaderWithSelectBoxProps> = ({
  label,
  value,
  setValue,
  errorText,
  touched,
  bold,
}) => {
  const inputRef = useRef<any>(null);
  // const auth = useAuth();

  const onChange = async (event: any) => {
    const file = event?.target?.files[0];
    if (!file) {
      showErrorToast('Invalid file');
      return;
    }

    const size = file.size / (1024 * 1024);

    if (size <= 0) {
      showErrorToast('Please upload valid file');
      return;
    }
    if (size > 3) {
      showErrorToast('File size is more than 3MB,please upload file size less than 3 mb');
      return;
    }

    const type = file.type;
    const formData = new FormData();
    formData.append('file', file);

    try {
      let API_URL: string;
      if (type === 'application/pdf') {
        API_URL = `${api.endpoints.upload.document}/${1}`;
      } else {
        API_URL = `${api.endpoints.upload.image}/${1}`;
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      const { status: apiStatus, data: apiData } = await api.post(API_URL, formData, headers);

      if (apiStatus === 200) {
        const { statusCode, data }: any = apiData;
        if (statusCode === 200) {
          setValue(data); // Ensure the returned data is the correct file path
        }
      } else {
        showErrorToast('Failed to upload file');
      }
    } catch (error) {
      showErrorToast('An error occurred during the file upload');
    }
  };

  const getUrl = (url: string) => {
    return isValidUrl(url) ? url : `${AWS_BUCKET_URL}/${url}`;
  };

  return (
    <div className="flex flex-col">
      <h4
        className={classNames(
          'mb-[6px] text-sm capitalize text-black',
          bold && '!text-base !font-normal'
        )}
      >
        {label}
      </h4>
      <div className="rounded border border-dashed border-gray-400 p-4">
        <input
          ref={inputRef}
          type="file"
          accept=".png ,.jpg ,.jpeg"
          name="file"
          className="hidden"
          onChange={onChange}
        />
        <label
          onClick={() => inputRef?.current?.click()}
          className="cursor-pointer text-blue-500 hover:underline"
        >
          Choose file
        </label>
      </div>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">PNG or JPG (MAX.3MB).</p>
      {isStr(value) && (
        <a
          href={getUrl(value)}
          className="h-[25px] w-[75px] cursor-pointer content-center rounded-lg bg-green-700 text-center text-xs font-medium text-white"
          target="_blank"
          rel="noreferrer"
        >
          View File
        </a>
      )}
      {touched && errorText && String(errorText)?.length > 0 && (
        <span className="text-xs text-red-600">{String(errorText)}</span>
      )}
    </div>
  );
};

export default CustomImageUpload;
