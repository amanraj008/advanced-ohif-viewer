import axios from 'axios';
import { getApiToken } from '../storage';
import { ensureHTTPS } from './utils';

// api base url should change according to environment it is deployed

export const BASE_URL = 'https://api.smaro.app/api';
export const AWS_BUCKET_URL = 'https://myradonapp.s3.amazonaws.com';

export const api = {
  get: async (url: string, params?: any) => {
    const token = getApiToken();
    url = ensureHTTPS(url);
    const config = {
      headers: {
        Token: token,
      },
      params,
    };
    return axios.get(url, config);
  },

  post: async (url: string, formData: any, headers = {}) => {
    const token = getApiToken();
    const config = {
      method: 'post',
      url: ensureHTTPS(url),
      headers: {
        ...headers,
        Token: token,
      },
      data: formData,
    };
    return axios(config);
  },
  put: async (url: string, params: any, headers = {}) => {
    const token = getApiToken();
    const config = {
      method: 'put',
      url: ensureHTTPS(url),
      headers: {
        ...headers,
        Token: token,
      },
      data: params,
    };
    return axios(config);
  },
  delete: async (url: string, params: any, headers = {}) => {
    const token = getApiToken();
    const config = {
      method: 'delete',
      url: ensureHTTPS(url),
      headers: {
        ...headers,
        Token: token,
      },
      data: params,
    };
    return axios(config);
  },
  endpoints: {
    report: {
      get: BASE_URL + '/diagnostics/patient/report',
    },
    report_analysis: {
      get: {
        id: BASE_URL + '/patient/report/analysis',
        radiologist: BASE_URL + '/radiologist/report/analysis',
        patient: BASE_URL + '/radiologist/report/analysis/patient',
      },
      update: BASE_URL + '/patient/report/analysis/update',
      reportPDF: BASE_URL + '/patient/report/analysis/pdf',
    },
    upload: {
      image: BASE_URL + '/upload/picture',
      document: BASE_URL + '/upload/picture',
    },
    modality: {
      get: BASE_URL + '/modality',
    },
    test_type: {
      get: BASE_URL + '/test-type',
      get_by_modality: BASE_URL + '/test-type/by/modality-id',
    },
    dicom: {
      upload: BASE_URL + '/upload/dicom/file ',
    },
    template: {
      get_radiologist_templates: BASE_URL + '/report-templates/radiologist/template/search',
    },
    report_images: {
      create: BASE_URL + '/patient/report/analysis/image/create',
      get: BASE_URL + '/patient/report/analysis/image',
      update: BASE_URL + '/patient/report/analysis/image/update',
    },
    authCheck: BASE_URL + '/check-auth-status',
  },
};
