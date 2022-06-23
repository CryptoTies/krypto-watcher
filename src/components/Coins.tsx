import React from 'react';
import Coin from './Coin';
import { ICoin } from '../models/ICoin';

interface Props {
  coins: ICoin[];
}

const Coins = ({ coins }: Props) => {
  return (
    <div>
      {coins.map(coin => (
        <Coin key={coin.id} coin={coin} />
      ))}
    </div>
  );
};

export default Coins;
