'use client';

import {Line, Bar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {obtenerNombreMes} from '@/utils/dateUtils';
import {ClimateData, HistoricalData} from '@/types/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const ClimateChart = ({
  climateData,
  historicalData,
}: {
  climateData: ClimateData;
  historicalData: HistoricalData[];
}) => {
  const months = climateData.monthly_data.map((m) => obtenerNombreMes(m.month));
  const tMax = climateData.monthly_data.map(
    (m) => m.data.find((d) => d.measure === 't_max')?.value,
  );
  const tMin = climateData.monthly_data.map(
    (m) => m.data.find((d) => d.measure === 't_min')?.value,
  );
  const prec = climateData.monthly_data.map(
    (m) => m.data.find((d) => d.measure === 'prec')?.value,
  );
  const solRad = climateData.monthly_data.map(
    (m) => m.data.find((d) => d.measure === 'sol_rad')?.value,
  );

  const createBarChartData = (
    label: string,
    data: (number | null | undefined)[],
    color: string,
  ) => ({
    labels: months,
    datasets: [
      {
        label,
        data,
        backgroundColor: color,
      },
    ],
    options: {
        maintainAspectRatio: false,
        responsive: true,
    },
  });

  const createLineChartData = (
    label: string,
    data: number[],
    color: string,
  ) => ({
    labels: months,
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color,
        fill: false,
      },
    ],
    options: {
        maintainAspectRatio: false,
    }
  });

  const noDataPlugin = {
    id: 'noData',
    afterDatasetsDraw: (chart: ChartJS) => {
      const {
        data,
        ctx,
        chartArea: {top, bottom, left, right},
      } = chart;
      ctx.save();
      console.log(data.datasets);
      const allEmpty = data.datasets.every((dataset) => dataset.data.every((val) => val === null || val === undefined));
      if (allEmpty) {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'; // Fondo gris claro
        ctx.fillRect(left, top, right - left, bottom - top);

        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(
          'No Data Available',
          (left + right) / 2,
          (top + bottom) / 2,
        );

        ctx.restore();
      }
    },
  };

  const plugin = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart: ChartJS) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
    defaults: {
      color: 'lightGreen',
    },
  };

  const processHistoricalData = (measure: string) => {
    return {
      labels: historicalData.map((d) => d.year.toString()),
      datasets: months
        .map((month, i) => {
          const data = historicalData.map(
            (yearData) =>
              yearData.monthly_data[i]?.data.find((d) => d.measure === measure)
                ?.value ?? null, 
          );

          
          if (data.every((val) => val === null)) return null;

          return {
            label: month,
            data,
            borderColor: `hsl(${(i * 30) % 360}, 70%, 50%)`,
            fill: false,
          };
        })
        .filter((dataset) => dataset !== null),
    };
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='bg-white shadow-md rounded-lg p-4 pb-[50px] h-auto min-h-[350px] max-h-[500px]' >
        <h2 className='text-xl font-bold'>
          Promedio histórico mensual de Precipitación (mm)
        </h2>
        <Bar data={createBarChartData('Precipitación', prec, 'green')} options={{ maintainAspectRatio: false }} plugins={[noDataPlugin]} />
      </div>
      <div className='bg-white shadow-md rounded-lg p-4 pb-[50px] h-auto min-h-[350px] max-h-[500px]'>
        <h2 className='text-xl font-bold'>
          Comportamiento histórico mensual de Precipitación
        </h2>
        <Line data={processHistoricalData('prec')} options={{ maintainAspectRatio: false }} plugins={[noDataPlugin]} />
      </div>

      <div className='bg-white shadow-md rounded-lg p-4 pb-[50px] h-auto min-h-[350px] max-h-[500px]'>
        <h2 className='text-xl font-bold'>
          Promedio histórico mensual de Radiación Solar
        </h2>
        <Bar
          data={createBarChartData('Radiación Solar', solRad, 'orange')} options={{ maintainAspectRatio: false }} plugins={[noDataPlugin]}
        />
      </div>
      <div className='bg-white shadow-md rounded-lg p-4 pb-[50px] h-auto min-h-[350px] max-h-[500px]'>
        <h2 className='text-xl font-bold'>
          Comportamiento histórico mensual de Radiación Solar
        </h2>
        <Line
          data={processHistoricalData('sol_rad')}  options={{ maintainAspectRatio: false }} plugins={[noDataPlugin]}
        />
      </div>

      <div className='bg-white shadow-md rounded-lg p-4 pb-[50px] h-auto min-h-[350px] max-h-[500px]'>
        <h2 className='text-xl font-bold'>
          Promedio histórico mensual de Temperatura Máxima (°C)
        </h2>
        <Bar data={createBarChartData('Temp. Máx', tMax, 'red')} options={{ maintainAspectRatio: false }} plugins={[noDataPlugin]} />
      </div>
      <div className='bg-white shadow-md rounded-lg p-4 pb-[50px] h-auto min-h-[350px] max-h-[500px]'>
        <h2 className='text-xl font-bold'>
          Comportamiento histórico mensual de Temperatura Máxima
        </h2>
        <Line data={processHistoricalData('t_max')} options={{ maintainAspectRatio: false }} plugins={[noDataPlugin]} />
      </div>

      <div className='bg-white shadow-md rounded-lg p-4 pb-[50px] h-auto min-h-[350px] max-h-[500px]'>
        <h2 className='text-xl font-bold'>
          Promedio histórico mensual de Temperatura Mínima (°C)
        </h2>
        <Bar data={createBarChartData('Temp. Mín', tMin, 'blue')} options={{ maintainAspectRatio: false }} plugins={[noDataPlugin]} />
      </div>
      <div className='bg-white shadow-md rounded-lg p-4 pb-[50px] h-auto min-h-[350px] max-h-[500px]'>
        <h2 className='text-xl font-bold'>
          Comportamiento histórico mensual de Temperatura Mínima
        </h2>
        <Line data={processHistoricalData('t_min')} options={{ maintainAspectRatio: false }} plugins={[noDataPlugin]} />
      </div>
    </div>
  );
};

export default ClimateChart;
