interface AnalysisTypes {
  report_analysis_id: number;
  patient_report_id: number;
  report_template: string;
  report_status: string;
  radiologist_id: number;
  radiologist_name: string;
  assigned_by: number;
  registration_date?: any;
  updated_time?: any;
}

interface PatientTypes {
  PatientID: string;
  gender: string;
  dob: string | Date;
  patient_name: string;
  patient_email: string;
  patient_mobile: string;
  address: string;
  age: number;
}

export interface ReportTypes {
  id: number; // report table id
  report_title: string;
  referral_doctor: string;
  ref_code: string;
  patient_id: number;
  patient_study_id: string;
  techniques: string;
  clinical_history: string | null;
  clinical_history_file: string | null;
  results_type: string;
  doctor_id: number;
  hospital_id: number;
  client_login_id: number;
  client_id: number;
  branch_id: number;
  doctor_name: string | null;
  modality_id: number;
  test_type_id: number;
  modality: string;
  test_type: string;
  report_status: string;
  clinical_history_count: number;
  priority_type: string;
  patient_study_instance_id: string;
  inserted_time: string;
  estatus: number;
  short_code: string;
  client_name: string;
  branch_name: string;
  impression: string;
  images: string[];
  template: {
    id: number;
    label: string;
    value: number;
    template: string;
    test_type_id: number;
    modality_id: number;
  };
}

export const initialAnalysisValues: ReportAnalysisTypes = {
  images: [],
  template: { id: 0, template: '', label: '', test_type_id: 0, modality_id: 0, value: 0 },
  PatientID: '',
  address: '',
  age: 0,
  assigned_by: 0,
  branch_id: 0,
  branch_name: '',
  client_id: 0,
  client_login_id: 0,
  client_name: '',
  clinical_history: '',
  report_template: '',
  techniques: '',
  clinical_history_count: 0,
  clinical_history_file: '',
  dob: '',
  doctor_id: 0,
  doctor_name: '',
  estatus: 0,
  gender: '',
  hospital_id: 0,
  id: 0,
  referral_doctor: '',
  report_title: '',
  radiologist_name: '',
  impression: '',
  inserted_time: '',
  modality: '',
  modality_id: 0,
  patient_email: '',
  patient_id: 0,
  patient_mobile: '',
  patient_name: '',
  patient_report_id: 0,
  patient_study_id: '',
  patient_study_instance_id: '',
  priority_type: '',
  radiologist_id: 0,
  ref_code: '',
  registration_date: undefined,
  report_analysis_id: 0,
  report_status: '',
  results_type: '',
  short_code: '',
  test_type: '',
  test_type_id: 0,
  updated_time: undefined,
};

export type ReportAnalysisTypes = AnalysisTypes & ReportTypes & PatientTypes;
