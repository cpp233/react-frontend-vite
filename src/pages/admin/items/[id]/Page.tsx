import React, { useState, useEffect } from 'react';
import {
  Divider,
  Col,
  Button,
  Form,
  Input,
  InputNumber,
  Switch,
  Spin,
  message,
} from 'antd';
import type { SelectProps } from 'antd';
import { LoadingOutlined, RollbackOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// import TagListComponent from '@components/TagListComponent';

import { useAppSelector, useAppDispatch } from '@hooks/reduxHook';
import { updateOneItemAction } from '@redux/actions/itemAction';
import { getOneById } from '@services/itemService';
import TagList from '@components/items/TagList';
import TagList2 from '@components/items/TagList2';

import { getType } from '@utils/utils';
import logger from '@utils/logger';

function ItemEdit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm<Item>();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [sourceContent, setSourceContent] = useState<Item>();

  // logger.trace({ id });

  useEffect(() => {
    if (!id) {
      return;
    }
    getOneById(id).then(res => {
      // logger.trace('getOneById:', res.data);
      setSourceContent(res.data);
      form.setFieldsValue(res.data);
      setLoading(false);
    });
  }, [id]);

  const onFinish = (values: Item) => {
    setLoading(true);
    // const count = typeof values.count === 'undefined' ? null : values.count;
    const newItem = {
      ...values,
      // count: count,
    };
    // console.log(newItem);
    // dispatch(createOneItem(newItem));
    // form.resetFields();

    form
      .validateFields()
      .then((validateFields: Item) => {
        // logger.trace('validateFieldsSuccess:', validateFields);
        if (!id) {
          message.warning('获取 id 失败');
          return;
        }

        const { tagList2, ...other } = validateFields;
        const body = {
          ...other,
          tagList2: tagList2?.map(item => {
            return item.name;
          }),
        };
        logger.trace('updateOneItemAction body:', body);
        dispatch(updateOneItemAction({ id: id, body: body })).finally(() => {
          setLoading(false);
        });
      })
      .catch(errorInfo => {
        logger.trace('validateFieldsFailure:', errorInfo);

        // errorInfo:
        //   {
        //     values: {
        //       username: 'username',
        //       password: 'password',
        //     },
        //     errorFields: [
        //       { name: ['password'], errors: ['Please input your Password!'] },
        //     ],
        //     outOfDate: false,
        //   }
        setLoading(false);
      });
  };

  return (
    <>
      <Spin
        spinning={loading}
        indicator={
          <LoadingOutlined style={{ fontSize: 50 }} spin></LoadingOutlined>
        }
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          colon={false}
          layout='horizontal'
          form={form}
          onFinish={onFinish}
          initialValues={sourceContent}
          autoComplete='off'
        >
          <Form.Item label=' '>
            <Col offset={21}>
              <Button
                icon={<RollbackOutlined />}
                onClick={() => {
                  navigate(-1);
                }}
              >
                返回
              </Button>
            </Col>
          </Form.Item>
          <Divider></Divider>
          <Form.Item
            name={'name'}
            label='名称'
            rules={[
              {
                type: 'string',
                required: true,
                min: 1,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={'quantity'}
            label='数量'
            rules={[
              {
                type: 'number',
                required: true,
                min: 0,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={'content'}
            label='描述'
            rules={[
              {
                type: 'string',
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name={'isShow'}
            label='是否显示'
            valuePropName='checked'
            rules={[
              {
                type: 'boolean',
              },
            ]}
          >
            <Switch checkedChildren='显示' unCheckedChildren='隐藏' />
          </Form.Item>
          {/* <Form.Item
            name={'tagList'}
            label='标签'
            rules={[
              {
                type: 'array',
                // message: 'default error alert',
                validator: (_, value: string[]) => {
                  for (const tag of value) {
                    const isString = getType(tag) === 'string';
                    if (!isString) {
                      return Promise.reject('需要输入字符串');
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TagList
              value={[]}
              onChange={
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => {}
              }
            />
          </Form.Item> */}
          <Form.Item name={'tagList2'} label='标签2'>
            <TagList2
              value={[]}
              onChange={
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => {}
              }
            ></TagList2>
          </Form.Item>
          <Form.Item label=' '>
            <Button type='primary' htmlType='submit'>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
}

export default ItemEdit;
