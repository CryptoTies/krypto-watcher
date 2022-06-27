import { ICoin } from './ICoin';

export interface IFetchedData {
  data: any;
  loading: boolean;
  error: unknown | Error;
}
