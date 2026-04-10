import React from 'react';
import { Card } from 'antd';
import { Column } from '@ant-design/plots';
import { CarItem, DictionaryItem } from '../services/carDictionaryService';

interface TrimBarChartProps {
  cars: CarItem[];
  trimLevels: DictionaryItem[];
}

const TrimBarChart: React.FC<TrimBarChartProps> = ({ cars, trimLevels }) => {
  const trimCounts = cars.reduce<Record<string, number>>((acc, car) => {
    const trim = trimLevels.find((item) => item.id === car.trimLevelId);
    const label = trim ? trim.name : 'Без комплектации';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(trimCounts).map(([type, value]) => ({ type, value }));

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    color: '#5B8FF9',
    columnWidthRatio: 0.6,
    label: {
      position: 'top',
      style: {
        fill: '#595959',
        opacity: 0.75,
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    meta: {
      value: {
        alias: 'Количество',
      },
    },
    interactions: [{ type: 'active-region' }],
  };

  return (
    <Card title="Комплектации автомобилей" style={{ flex: 1, minWidth: 320 }}>
      <Column {...config} />
    </Card>
  );
};

export default TrimBarChart;
