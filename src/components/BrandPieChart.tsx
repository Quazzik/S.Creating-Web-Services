import React from 'react';
import { Card } from 'antd';
import { Pie } from '@ant-design/plots';
import { CarItem, DictionaryItem } from '../services/carDictionaryService';

interface BrandPieChartProps {
  cars: CarItem[];
  carBrands: DictionaryItem[];
}

const BrandPieChart: React.FC<BrandPieChartProps> = ({ cars, carBrands }) => {
  const brandCounts = cars.reduce<Record<string, number>>((acc, car) => {
    const brand = carBrands.find((item) => item.id === car.carBrandId);
    const label = brand ? brand.name : 'Без бренда';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(brandCounts).map(([type, value]) => ({ type, value }));

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: ({ type, percent }: { type: string; percent: number }) =>
        `${type} ${typeof percent === 'number' ? `${(percent * 100).toFixed(1)}%` : ''}`,
      style: {
        fontSize: 12,
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <Card title="Автомобили конкретных марок" style={{ flex: 1, minWidth: 320 }}>
      <Pie {...config} />
    </Card>
  );
};

export default BrandPieChart;
