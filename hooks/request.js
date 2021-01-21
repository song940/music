import { getJSON } from 'https://lsong.org/scripts/http.js';
import { useState, useEffect } from '../tinyact.js';

export const useRequest = url => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getJSON(url).then(res => {
      setData(res);
      setLoading(false);
    }, err => {
      setError(err);
      setLoading(false);
    });
  }, []);
  return { loading, error, data };
};
