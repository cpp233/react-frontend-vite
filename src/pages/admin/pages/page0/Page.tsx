import React from 'react';
import { Card, Typography } from 'antd';

const Page0 = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Card title={<Typography.Title>Page0</Typography.Title>}>
        <Typography.Text>Content</Typography.Text>
      </Card>
    </div>
  );
};

export default Page0;
