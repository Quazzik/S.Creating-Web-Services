import React from 'react';
import { ConfigProvider, theme } from 'antd';

export function rootContainer(container: React.ReactNode) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      {container}
    </ConfigProvider>
  );
}