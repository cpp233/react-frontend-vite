import React from 'react';
import { Card, Typography, Input, QRCode, Space } from 'antd';

const Page2 = () => {
  const [text, setText] = React.useState('https://ant.design/');
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Card title={<Typography.Title>二维码</Typography.Title>}>
        <Space direction='vertical' align='center'>
          <QRCode value={text || '-'} />
          <Input.TextArea
            rows={10}
            style={{ width: '500px' }}
            placeholder='-'
            maxLength={1024}
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </Space>
      </Card>
    </div>
  );
};

export default Page2;
