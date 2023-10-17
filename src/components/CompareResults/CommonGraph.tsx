import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  TooltipItem,
} from 'chart.js';
import 'chart.js/auto';
import * as kde from 'fast-kde';
import { Line } from 'react-chartjs-2';
import { style } from 'typestyle';

import { Spacing } from '../../styles';

ChartJS.register(LinearScale, LineElement);

interface GraphData {
  x: number;
  y: number | string;
}

const styles = {
  container: style({
    display: 'flex',
    marginBottom: Spacing.Medium,
    width: '100%',
  }),
};

function CommonGraph(props: CommonGraphProps) {
  const { baseRevisionRuns, newRevisionRuns } = props;

  const options = {
    plugins: {
      legend: {
        align: 'start' as const,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            return `${(context.raw as GraphData).y}`;
          },
        },
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          offset: false,
        },
        type: 'linear' as const,
      },
      y: {
        beginAtZero: true,
        ticks: {
          beginAtZero: true,
          display: true,
        },
        grid: {
          drawBorder: false,
          display: false,
          offset: false,
        },
      },
    },
  };

  //////////////////// START FAST KDE ////////////////////////
  const baseRunsDensity = Array.from(
    kde.density1d([...baseRevisionRuns.values], {
      bandwidth: baseRevisionRuns.stddev,
      extent: [
        Math.min(...baseRevisionRuns.values),
        Math.max(...baseRevisionRuns.values),
      ],
    }),
  );
  const newRunsDensity = Array.from(
    kde.density1d([...newRevisionRuns.values], {
      bandwidth: newRevisionRuns.stddev,
      extent: [
        Math.min(...newRevisionRuns.values),
        Math.max(...newRevisionRuns.values),
      ],
    }),
  );

  //////////////////// END FAST KDE   ////////////////////////

  const data = {
    datasets: [
      {
        label: 'Base',
        data: baseRunsDensity,
        fill: false,
        borderColor: 'rgba(144, 89, 255, 1)',
      },
      {
        label: 'New',
        data: newRunsDensity,
        fill: false,
        borderColor: 'rgba(0, 135, 135, 1)',
      },
    ],
  };

  return (
    <div className={styles.container}>
      <Line options={options} data={data} />
    </div>
  );
}

interface CommonGraphProps {
  baseRevisionRuns: {
    name: string;
    median: number;
    values: number[];
    stddev: number;
    stddevPercent: number;
  };
  newRevisionRuns: {
    name: string;
    median: number;
    values: number[];
    stddev: number;
    stddevPercent: number;
  };
}

export default CommonGraph;
