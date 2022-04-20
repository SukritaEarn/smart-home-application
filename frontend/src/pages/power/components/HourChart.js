import React,{useState,useEffect} from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";

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


export default function ApexColumnAreaChart(props) {

  return (
    <ApexCharts
      options={chartSettings}
      series={props.data}
      type="bar"
      height={300}
    />
  );
}
