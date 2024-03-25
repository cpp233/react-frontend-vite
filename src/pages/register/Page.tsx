import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Form, Input, Button, message, Card, Spin } from 'antd';
import { AxiosError } from 'axios';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { register } from '@services/authService';
import logger from '@utils/logger';

import './Register.css';

interface Fields {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values: Fields) => {
    try {
      logger.trace(values);
      const { data } = await register({
        username: values.username,
        password: values.password,
      });
      // setUser(data, values.remember);
      message.success('注册成功');
      navigate('/login');
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      logger.error([error]);
      message.error(error?.response?.data?.error);
    }
  };

  const handleNavToLogin = () => {
    navigate('/login');
  };

  return (
    <Layout className='register-layout'>
      <Spin spinning={submitting}>
        <Card
          title='注册'
          className='register-card-form'
          extra={<Button onClick={handleNavToLogin}>回到登陆</Button>}
        >
          <Form
            form={form}
            className='register-form'
            initialValues={{
              remember: true,
            }}
            onFinish={handleRegister}
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
            <Form.Item
              name='confirmPassword'
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  validator: (_, value) => {
                    const password = form.getFieldValue('password');
                    if (password !== value) {
                      return Promise.reject('两次密码不一致');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='确认密码'
                autoComplete='true'
              />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type='primary'
                htmlType='submit'
                className='register-form-button'
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </Layout>
  );
};

export default Register;
