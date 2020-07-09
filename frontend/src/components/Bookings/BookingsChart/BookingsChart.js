import React from "react";
import { Bar as BarChart } from "react-chartjs-2";

import "./BookingsChart.css";

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 10000000,
  },
};

const bookingsChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price <= BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: bucket,
      backgroundColor: "rgba(255, 247, 15, 0.5)",
      borderColor: "rgba(252, 227, 83, 1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255, 239, 15, 0.6)",
      hoverBorderColor: "rgba(248, 226, 100, 1)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div className="bookings-chart">
      <BarChart data={chartData} />
    </div>
  );
};

export default bookingsChart;
