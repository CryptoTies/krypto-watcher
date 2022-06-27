import { useState, useEffect, useRef } from 'react';
import { ICoin } from '../models/ICoin';
import { IFetchedData } from '../models/IFetchedData';
import axios from 'axios';
import { ICryptoApiRes } from '../models/ICryptoApiRes';

const UseFetch = (api: string) => {
  const [allData, setAllData] = useState<IFetchedData>({
    data: [] as ICoin[],
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
      const { data } = await axios.get<ICryptoApiRes>(api);
      setAllData(currAllData => ({
        ...currAllData,
        data: data.coins as ICoin[],
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
      const { data } = await axios.get<ICryptoApiRes>(api);
      setSpecificData(currSpecificData => ({
        ...currSpecificData,
        data: data.coin as ICoin,
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
  };
};

export default UseFetch;
