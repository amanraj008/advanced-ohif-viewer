import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isStr } from '../utils';
import { setApiToken } from '../../storage';
export default function useToken() {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [reportId, setReportId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const _token = params.get('bearer');
    if (isStr(_token)) {
      const decoded_token = decodeURIComponent(_token);
      setApiToken(decoded_token);
      setToken(decoded_token);
    }
    const report_id = params.get('reportId');
    if (isStr(report_id)) {
      setReportId(Number(report_id));
    }
  }, [location.search]);

  return { token, reportId };
}
