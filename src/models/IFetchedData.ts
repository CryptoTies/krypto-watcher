import { ICoin } from './ICoin';

export interface IFetchedData {
  data: ICoin[] | ICoin;
  loading: boolean;
  error: unknown | Error;
}
