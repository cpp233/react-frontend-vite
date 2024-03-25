import React from 'react';
import { Card, Typography } from 'antd';

const Page = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Card title={<Typography.Title>Page3</Typography.Title>}>
        <Typography.Text>Content Page3</Typography.Text>
      </Card>
    </div>
  );
};

export default Page;
