import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CryptoInfo } from './models/CryptoInfo';
import { ApiRes } from './models/ApiRes';

const App: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get<ApiRes>('https://api.coinstats.app/public/v1/coins?skip=0');
      setCryptoData(res.data.coins);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Welcome to Krypto Watcher!</h1>
      {cryptoData.map(coin => (
        <div key={coin.id}>
          <h2>Name: {coin.name}</h2>
          <p>Symbol: {coin.symbol}</p>
          <p>Price: {coin.price}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
