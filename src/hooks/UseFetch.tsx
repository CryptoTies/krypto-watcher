import { useState, useEffect, useRef } from 'react';
import { ICoin } from '../models/ICoin';
import { IFetchedData } from '../models/IFetchedData';

import axios from 'axios';

const UseFetch = (api: string) => {
  const [allData, setAllData] = useState<IFetchedData>({
    data: [],
    loading: false,
    error: null,
  });

  const [specificData, setSpecificData] = useState<IFetchedData>({
    data: {} as ICoin,
    loading: false,
    error: null,
  });

  const fetchAllDataRef = useRef(() => {});
  const fetchSpecificDataRef = useRef(() => {});

  fetchAllDataRef.current = async () => {
    setAllData(currAllData => ({
      ...currAllData,
      loading: true,
    }));
    try {
      const { data } = await axios.get(api);
      setAllData(currAllData => ({
        ...currAllData,
        data,
      }));
    } catch (err) {
      setAllData(currAllData => ({
        ...currAllData,
        error: err,
      }));
    }
    setAllData(currAllData => ({
      ...currAllData,
      loading: false,
    }));
  };

  fetchSpecificDataRef.current = async () => {
    setSpecificData(currSpecificData => ({
      ...currSpecificData,
      loading: true,
    }));
    try {
      const { data } = await axios.get(api);
      setSpecificData(currSpecificData => ({
        ...currSpecificData,
        data,
      }));
    } catch (err) {
      setSpecificData(currSpecificData => ({
        ...currSpecificData,
        error: err,
      }));
    }
    setSpecificData(currSpecificData => ({
      ...currSpecificData,
      loading: false,
    }));
  };

  useEffect(() => {
    fetchAllDataRef.current();
    fetchSpecificDataRef.current();
  }, []);

  return {
    allData,
    specificData,
    fetchAllData: fetchAllDataRef.current,
    fetchSpecificData: fetchSpecificDataRef.current,
  };
};

export default UseFetch;
