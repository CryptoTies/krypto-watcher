import { useState, useEffect } from 'react';
import axios from 'axios';
import { ICoin } from '../models/ICoin';
import { ICryptoApiRes } from '../models/ICryptoApiRes';
import Coins from './Coins';

const Home = () => {
  const [cryptoData, setCryptoData] = useState<ICoin[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { coins },
      } = await axios.get<ICryptoApiRes>(
        'https://api.coinstats.app/public/v1/coins?skip=0'
      );
      setCryptoData(coins);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Welcome to Krypto Watcher!</h1>
      <Coins coins={cryptoData} />
    </div>
  );
};

export default Home;
