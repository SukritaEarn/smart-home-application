import React from "react";
import ApexCharts from "react-apexcharts";

const series = [
  {
    name: "TV",
    data: [234, 320, 222, 100, 200, 333, 221],
  },
  {
    name: "Fan",
    data: [150, 160, 130, 20, 20, 320, 150],
  },
];

const chartSettings = {
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    type: "category",
    categories: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
    labels: {
      style: {
        colors: "#6B859E",
        opacity: 0.7,
      },
    },
  },
  yaxis: {
    title: {
      text: 'kilowatt-hour',
      colors: ["#6B859E"],
    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 1,
      stops: [40, 90, 100]
    }
  },
  colors: ["#4D53E0", "#41D5E2"],
  chart: {
    toolbar: {
      show: false,
    },
  },
  legend: {
    show: true,
    horizontalAlign: "center",
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " kWh"
      }
    }
  }
};

export default function ApexLineChart() {
  return (
    <ApexCharts
      options={chartSettings}
      series={series}
      type="area"
      height={300}
    />
  );
}
