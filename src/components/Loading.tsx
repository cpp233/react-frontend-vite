import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Col, Row, Spin } from 'antd';

const App: React.FC = () => (
  // 垂直 水平 居中
  <div
    className='loading'
    style={{
      position: 'relative',
      // display: 'flex',
      height: '100%',
      width: '100%',
    }}
  >
    <Spin
      style={{
        //  margin: 'auto'
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
    />
  </div>
);

export default App;
