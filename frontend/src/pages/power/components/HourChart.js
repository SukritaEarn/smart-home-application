import React from "react";
import ApexCharts from "react-apexcharts";

const series = [{
  name: 'TV',
  data: [2, 2, 3, 1, 1, 5, 4]
}, {
  name: 'Fan',
  data: [5, 4, 3, 2, 3, 8, 5]
}];

const chartSettings = {
  colors: ["#FFCA41", "#43BC13"],
  chart: {
    toolbar: {
      show: false,
    },
    type: 'bar',
    height: 350
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  fill: {
    opacity: 1
  },
  labels: [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ],
  markers: {
    size: 0
  },
  xaxis: {
    type: 'category',
    labels: {
      style: {
        colors: "#6B859E",
      },
    },
  },
  yaxis: {
    title: {
      text: 'Hours',
      colors: ["#6B859E"],
    }
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " hrs."
      }
    }
  }
};


export default function ApexColumnAreaChart() {
  return (
    <ApexCharts
      options={chartSettings}
      series={series}
      type="bar"
      height={300}
    />
  );
}
