import { IChart } from '../models/IChart';

const formatChartData = (chartData: any[]): IChart => {
  const [date, chartObj] = chartData;
  const [open, high, low, close, volume] = Object.values(chartObj);
  return {
    date: new Date(date),
    open: Number(open),
    high: Number(high),
    low: Number(low),
    close: Number(close),
    volume: Number(volume),
  };
};

export const getChartData = async (symbol: string) => {
  const res = await fetch(
    `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=${symbol}&market=USD&interval=5min&apikey=LZ830RKAZD7ZRGBM`
  );
  const data = await res.json();
  console.log('data', data);
  const chartData = Object.entries(data['Time Series Crypto (5min)'])[0] ?? [];
  console.log('Chart Data', chartData);
  const formattedChartData = formatChartData(chartData);
  console.log('formattedChartData', formattedChartData);
  return formattedChartData;
};
