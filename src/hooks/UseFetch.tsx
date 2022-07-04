import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const UseFetch = (api: string) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  const fetchDataRef = useRef(() => {});

  fetchDataRef.current = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<any>(api);
      setData(data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataRef.current();
  }, []);

  return [data, loading, error];
};

export default UseFetch;
