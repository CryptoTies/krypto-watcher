import { IChartData } from '../models/IChartData';

const formatChartData = (chartData: IChartData[]) => {
  return chartData.map((chartObj: IChartData) => {
    const { time, open, high, low, close } = chartObj;

    return {
      x: new Date(time),
      y: [open, high, low, close],
    };
  });
};

export const getChartData = async (symbol: string) => {
  const res = await fetch(
    `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=10`
  );
  const {
    Data: { Data },
  } = await res.json();
  const formattedChartData = formatChartData(Data);
  return formattedChartData;
};
