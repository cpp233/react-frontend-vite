import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Card,
  Spin,
} from 'antd';
import { AxiosError } from 'axios';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// import Centering from '../../components/Centering';
// import Gradients from '../../components/Gradients';

import { login } from '@services/authService';
import { setUser } from '@utils/auth';
import logger from '@utils/logger';

import './Login.css';

interface Fields {
  username: string;
  password: string;
  remember: boolean;
}

const Login = () => {
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (values: Fields) => {
    try {
      setSubmitting(true);

      const { data } = await login({
        username: values.username,
        password: values.password,
      });
      setUser(data, values.remember);
      setSubmitting(false);

      navigate('/');
      message.success('登录成功');
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      logger.error({ error });
      message.error(error.response?.data?.error);
      setSubmitting(false);
    }
  };

  const handleNavToRegister = () => {
    navigate('/register');
  };

  return (
    // <Gradients>
    //   <Centering width='20' maxWidth='20'>

    <Layout className='login-layout'>
      <Spin spinning={submitting}>
        <Card title='登陆' className='login-card-form'>
          <Form
            name='normal_login'
            className='login-form'
            initialValues={{
              remember: true,
            }}
            onFinish={handleLogin}
          >
            <Form.Item
              name='username'
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='用户名'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='密码'
                autoComplete='true'
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>记住登陆状态</Checkbox>
              </Form.Item>
              <Button type='link' onClick={handleNavToRegister}>
                没有账号？立即注册
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                block
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </Layout>

    //   </Centering>
    // </Gradients>
  );
};

export default Login;
