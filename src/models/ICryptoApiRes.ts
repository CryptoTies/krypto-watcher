import { ICoin } from './ICoin';

export interface ICryptoApiRes {
  coins?: ICoin[];
  coin?: ICoin;
}
