export const configChartOptions = (title: string) => {
  return {
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: title,
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };
};
