import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { api, AWS_BUCKET_URL, BASE_URL } from './api';
import { isNum, isStr, isArray, isValidUrl } from './utils';
import { ReportAnalysisTypes } from './types/ReportAnalysisTypes';
import { initialAnalysisValues } from './types/ReportAnalysisTypes';
import { showErrorToast, showSuccessToast } from './components/notify';
import { Toaster } from 'react-hot-toast';
import LabelHWrap from './components/LabelHWrap';
import CustomInput from './components/CustomInput';
import ReportImages from './components/ReportImages';
import CustomSelectBox from './components/CustomSelectBox';
import DiagnosisSection from './components/DiagnosisSection';
import useToken from './hooks/useToken';

interface TemplateDataTypes {
  id: number;
  test_type_id: number;
  modality_id: number;
  report_template_name: string;
  template: string;
}

interface OptionsTypes {
  value: number;
  label: string;
}

type TemplateOptionTypes = TemplateDataTypes & OptionsTypes;

type ApiDataTypes = {
  statusCode: number;
  data?: any;
  message?: string;
  error?: string;
};

interface DefaultSectionDataTypes {
  sectionName: string;
  dataName: keyof ReportAnalysisTypes;
  isEditable: boolean;
}
const DataLabel = ({ label, value }: { label: string; value: any }) => {
  return (
    <div className="w-full min-w-max">
      <LabelHWrap label={label}>
        <p className="min-w-max font-bold text-black">{value}</p>
      </LabelHWrap>
    </div>
  );
};

const report_result_options = [
  { label: 'Select Result Status', value: '', color: 'black' },
  { label: 'Normal', value: 'Normal', color: 'black' },
  { label: 'Abnormal', value: 'Abnormal', color: 'black' },
];

const defaultSections: DefaultSectionDataTypes[] = [
  { sectionName: 'Clinical Information', dataName: 'clinical_history', isEditable: false },
  { sectionName: 'Technique', dataName: 'techniques', isEditable: false },
  { sectionName: 'Report', dataName: 'report_template', isEditable: true },
];

const Report: React.FC = () => {
  const { token, reportId } = useToken();
  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: initialAnalysisValues,
    onSubmit: async (params: ReportAnalysisTypes) => {
      await updatePatientReportAnalysis(params);
    },
  });

  const [templates, setTemplates] = useState<TemplateOptionTypes[]>([]);

  const onSelectTemplate = (option: TemplateOptionTypes) => {
    void setFieldValue('modality_id', option.modality_id);
    void setFieldValue('test_type_id', option.test_type_id);
    void setFieldValue('template_id', option.id);
    void setFieldValue('report_template', option.template);
    void setFieldValue('report_title', option.label);
    void setFieldValue('template', option);
  };

  const getUrl = (url: string) => {
    return isValidUrl(url) ? url : `${AWS_BUCKET_URL}/${url}`;
  };

  const getTemplates = async (radiologist_id: number) => {
    try {
      if (!isNum(radiologist_id)) {
        showErrorToast('Invalid User Id');
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
      };
      const params = JSON.stringify({
        radiologist_id: radiologist_id,
      });
      const { status: apiStatus, data: apiData } = await api.post(
        api.endpoints.template.get_radiologist_templates,
        params,
        headers
      );

      if (apiStatus === 200) {
        const { statusCode, data } = apiData as unknown as ApiDataTypes;
        if (statusCode === 200) {
          const filtered: TemplateOptionTypes[] = data.map((item: TemplateDataTypes) => {
            return {
              id: item.id,
              value: item.id,
              label: item.report_template_name,
              modality_id: item.modality_id,
              test_type_id: item.test_type_id,
              template: item.template,
            };
          });

          setTemplates(filtered);
        } else {
          showErrorToast('Report templates not found,please add some templates');
        }
      }
    } catch (e) {
      showErrorToast('Report templates not found,please add some templates');
    }
  };

  const fetchReportImages = async (report_analysis_id: number) => {
    if (!isNum(report_analysis_id)) {
      return;
    }
    try {
      const { data: apiData } = await api.get(
        `${api.endpoints.report_images.get}/${report_analysis_id}`
      );
      const { data, statusCode } = apiData;
      if (statusCode === 200) {
        const images_map = data.map((item: { image: string }) => {
          return `${AWS_BUCKET_URL}/${item.image}`;
        });
        void setFieldValue('images', images_map);
      }
    } catch (e) {
      showErrorToast('Something went wrong');
    }
  };

  const createReportImages = async () => {
    const params = values.images.map(item => {
      return { report_analysis_id: values.report_analysis_id, image: item };
    });
    const payload = { reportImages: params };
    try {
      const { data: apiData } = await api.post(api.endpoints.report_images.create, payload);
      const { statusCode, data } = apiData as unknown as ApiDataTypes;

      if (statusCode === 200) {
        showSuccessToast('Image uploaded successfully');
        void setFieldValue('images', data);
      } else {
        showErrorToast('Something went wrong');
      }
    } catch (e) {
      showErrorToast('Something went wrong,please try again');
    }
  };

  const updatePatientReportAnalysis = async (params: ReportAnalysisTypes) => {
    try {
      if (!params.id) {
        showErrorToast('Invalid Report Id');
        return;
      }
      if (!params.report_analysis_id) {
        showErrorToast('Invalid Report Analysis ID');
        return;
      }
      if (!isStr(params?.patient_study_id)) {
        showErrorToast('Invalid Study Id');
        return;
      }

      if (!isStr(params?.patient_study_instance_id)) {
        showErrorToast('Invalid Study Instance Id');
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
      };

      const { status: apiStatus, data: apiData } = await api.post(
        api.endpoints.report_analysis.update,
        JSON.stringify(params),
        headers
      );
      if (apiStatus === 200) {
        const { statusCode } = apiData as unknown as ApiDataTypes;
        if (statusCode === 200) {
          if (isArray(values.images)) {
            await handleReportImages();
            await getPatientReport(values.id);
          }
          showSuccessToast('Success! Patient Report Saved');
        }
      } else {
        showErrorToast('Failure! Patient Report Not Saved');
      }
    } catch (e) {
      showErrorToast('Something went wrong,please try again');
    }
  };

  const getPatientReport = async (id: number) => {
    if (!isNum(id)) {
      showErrorToast('Invalid Report Id');
      return;
    }
    try {
      const API_URL = api.endpoints.report.get + '/' + id;
      const { status: apiStatus, data: apiData } = await api.get(API_URL, {});

      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          if (isArray(data)) {
            const result: ReportAnalysisTypes = data[0];
            const patientId = isStr(result?.PatientID)
              ? result?.PatientID
              : result?.patient_id ?? '';
            const referral_doctor = isStr(result?.referral_doctor)
              ? result?.referral_doctor
              : result?.doctor_name ?? '';
            void setFieldValue('id', result?.id);
            void setFieldValue('radiologist_id', result?.radiologist_id);
            void setFieldValue('branch_name', result?.branch_name);
            void setFieldValue('radiologist_name', result?.radiologist_name);
            void setFieldValue('report_analysis_id', result?.report_analysis_id);
            void setFieldValue('PatientID', patientId);
            void setFieldValue('patient_id', result?.patient_id);
            void setFieldValue('patient_name', result?.patient_name);
            void setFieldValue('age', result?.age);
            void setFieldValue('gender', result?.gender);
            void setFieldValue('referral_doctor', referral_doctor);
            void setFieldValue('priority_type', result?.priority_type);
            const results_type = isStr(result?.results_type) ? result?.results_type : 'Normal';
            void setFieldValue('results_type', results_type);
            void setFieldValue('report_status', result?.report_status);
            void setFieldValue('modality_id', result?.modality_id);
            void setFieldValue('test_type_id', result?.test_type_id);
            void setFieldValue('clinical_history', result?.clinical_history);
            void setFieldValue('clinical_history_file', result?.clinical_history_file);
            void setFieldValue('techniques', result?.techniques);
            void setFieldValue('report_template', result?.report_template);
            void setFieldValue('report_title', result?.report_title);
            void setFieldValue('patient_study_id', result?.patient_study_id);
            void setFieldValue('client_id', result?.client_id);
            void setFieldValue('branch_id', result?.branch_id);
            void setFieldValue('patient_study_id', result?.patient_study_id);
            void setFieldValue('patient_study_instance_id', result?.patient_study_instance_id);
            await getTemplates(result?.radiologist_id);
            await fetchReportImages(result?.report_analysis_id);
          } else {
            showErrorToast('Unable to fetch patient report');
          }
        } else {
          showErrorToast('Unable to fetch patient report');
        }
      }
    } catch (e) {
      showErrorToast('Unable to fetch patient report');
    }
  };

  const updateReportImages = async (data: string[]) => {
    const params = data.map(item => {
      return { report_analysis_id: values.report_analysis_id, image: item };
    });
    const payload = {
      report_analysis_id: values.report_analysis_id,
      reportImages: params,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const { data: apiData } = await api.put(api.endpoints.report_images.update, payload, headers);
      const { statusCode } = apiData as unknown as ApiDataTypes;
      if (statusCode === 200) {
        showSuccessToast('Image updated successfully');
      } else {
        showErrorToast('Image update failed');
      }
    } catch (e) {
      showErrorToast('Upload failed please try again');
    }
  };

  const handleReportImages = async () => {
    if (!values.images.length) {
      await updateReportImages([]);
      return;
    }

    const flag = values.images.find(item => item.includes(AWS_BUCKET_URL));
    if (flag) {
      const filtered_images = values.images.map(item => {
        return item.replace(`${AWS_BUCKET_URL}/`, '');
      });
      await updateReportImages(filtered_images);
      return;
    }
    await createReportImages();
  };

  const getReportStatus = (status: string) => {
    if (status === 'Inprocess') {
      return 'In Progress';
    }
    return status;
  };

  const referral_doctor = isStr(values?.referral_doctor)
    ? values?.referral_doctor
    : values?.doctor_name ?? '';

  useEffect(() => {
    if (isStr(token) && isNum(reportId)) {
      void (async () => {
        await getPatientReport(reportId);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reportId]);

  if (!isNum(values?.id)) {
    return (
      <div className="flex h-full w-full content-center items-center justify-center rounded border border-gray-400 bg-white p-1 text-center">
        {isStr(token) ? (
          <span className="text-bold animate-pulse text-xl text-red-700">
            Loading, please wait...
          </span>
        ) : (
          <span className="text-bold text-xl text-red-700">
            You are not authorised to view this panel, Please exit.
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ position: 'relative' }}
      className="min-h-[calc(100vh-100px)] w-full overflow-y-auto rounded border border-gray-400 bg-white p-1"
    >
      <Toaster />
      <div className="w-full border-gray-400 bg-purple-200 p-1">
        <div className="mb-4 grid w-full grid-cols-2 gap-y-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <DataLabel label="Patient Id" value={values?.patient_id} />
          <DataLabel label="Name" value={values?.patient_name} />
          <DataLabel label="Gender" value={values?.gender} />
          <DataLabel label="Age" value={values?.age} />
          <DataLabel label="Diagnostics" value={values?.branch_name} />
          <DataLabel label="Doctor" value={referral_doctor} />
          <DataLabel label="Radiologist" value={values?.radiologist_name} />
          <DataLabel label="Priority" value={values?.priority_type} />
          <DataLabel label="Report Status" value={getReportStatus(values?.report_status)} />
        </div>
        <div className="grid w-full gap-y-3">
          <LabelHWrap label="Report Title">
            <CustomInput
              value={values.report_title}
              onChange={e => setFieldValue('report_title', e.target.value)}
              placeholder="Enter Report Title"
            />
          </LabelHWrap>
          <LabelHWrap label="Result">
            <CustomSelectBox
              label="Select Result"
              options={report_result_options}
              setValue={option => setFieldValue('results_type', option.value)}
              value={values.results_type}
            />
          </LabelHWrap>
          <LabelHWrap label="Template">
            <CustomSelectBox
              label="Select Template"
              options={templates}
              setValue={option => onSelectTemplate(option)}
              value={values.template.value}
            />
          </LabelHWrap>
        </div>
      </div>

      <div>
        {isStr(values?.clinical_history_file) && (
          <div className="my-1">
            <h4 className="mb-2 text-sm font-bold text-black">Prescription</h4>
            <a
              href={getUrl(String(values.clinical_history_file))}
              target="_blank"
              className="h-[35px] w-[150px] content-center items-center rounded bg-blue-700 p-1 text-center text-sm text-white dark:text-white"
              rel="noreferrer"
            >
              View File
            </a>
          </div>
        )}
      </div>
      <div className="my-3 w-full">
        {values &&
          defaultSections.map(section => (
            <DiagnosisSection
              key={section.dataName}
              isEditEnabled={section.isEditable}
              sectionName={section.sectionName}
              dataName={section.dataName}
              onChangeValue={setFieldValue}
              value={values[section.dataName]}
            />
          ))}
      </div>

      <div className="my-3 w-full pt-5">
        <h1 className="mb-5 font-bold text-black">Upload Images</h1>
        <ReportImages
          initialImages={values.images}
          onChange={_images => setFieldValue('images', _images)}
        />
      </div>

      <div
        style={{ position: 'fixed', bottom: '10px', right: '10px' }}
        className="absolute z-20 flex items-center justify-end gap-x-2 border-[#CED4DA] px-4"
      >
        <button className="rounded-[4px] bg-[#6C757D] p-2 text-base font-semibold text-white">
          Cancel
        </button>
        <a
          href={`${BASE_URL}/orthanc/study/files/${values.patient_study_id}`}
          className="rounded-[4px] bg-blue-700 p-2 text-base font-semibold text-white"
          rel="noreferrer"
        >
          Download Files
        </a>
        <button
          className="rounded-[4px] bg-green-700 p-2 text-base font-semibold text-white"
          onClick={() => handleSubmit()}
        >
          Send Report Back
        </button>
      </div>
    </div>
  );
};

export default Report;
