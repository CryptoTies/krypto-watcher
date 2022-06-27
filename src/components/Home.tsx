import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig';
import axios from 'axios';
import { ICoin } from '../models/ICoin';
import { ICryptoApiRes } from '../models/ICryptoApiRes';
import Coins from './Coins';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [cryptoData, setCryptoData] = useState<ICoin[]>([]);

  const navigate = useNavigate();

  const [user, loading] = useAuthState(auth);

  const fetchData = async () => {
    const {
      data: { coins },
    } = await axios.get<ICryptoApiRes>(
      'https://api.coinstats.app/public/v1/coins?skip=0'
    );
    setCryptoData(coins);
  };

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    } else if (user) {
      fetchData();
    }
  }, [user, loading, navigate]);

  return (
    <>
      {user && !loading && (
        <div className={styles.home}>
          <h1>Welcome to Krypto Watcher!</h1>
          <Coins coins={cryptoData} />
        </div>
      )}
    </>
  );
};

export default Home;
