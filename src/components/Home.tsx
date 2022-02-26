import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CryptoInfo } from '../models/CryptoInfo';
import { ApiRes } from '../models/ApiRes';

const Home: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoInfo[]>([]);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get<ApiRes>('https://api.coinstats.app/public/v1/coins?skip=0');
      setCryptoData(res.data.coins);
    };
    fetchData();
  }, []);
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/login'>Login</Link>
          </li>
          <li>
            <Link to='/register'>Register</Link>
          </li>
        </ul>
      </nav>
      <h1>Welcome to Krypto Watcher!</h1>
      {cryptoData.map(coin => (
        <div key={coin.id}>
          <h2>Name: {coin.name}</h2>
          <p>Symbol: {coin.symbol}</p>
          <p>Price: {formatter.format(coin.price)}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
