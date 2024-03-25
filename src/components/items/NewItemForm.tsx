import React from 'react';
import { Form, Input, InputNumber, Switch, Button, Select, Spin } from 'antd';
import { ButtonProps, InputProps, InputNumberProps } from 'antd';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';

import { useAppDispatch, useAppSelector } from '@hooks/reduxHook';
import { createOneItemAction } from '@redux/actions/itemAction';

import ItemField from '@components/items/ItemField';
import TagList from '@components/items/TagList';

import { newItemSchema } from '@components/items/validate';
import logger from '@utils/logger';

function NewItemForm() {
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { loading, list } = useAppSelector(state => {
    return state.tags;
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    // errors,
  } = useForm<NewFormItem>({ resolver: zodResolver(newItemSchema) });

  // 当errors 不是空对象时
  if (Object.keys(errors).length > 0) {
    logger.trace({ errors });
  }

  const onSubmit = (data: NewFormItem) => {
    setSubmitting(true);
    // logger.trace(data);
    dispatch(createOneItemAction(data)).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <Spin spinning={submitting}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        // onSubmit={(e, ...other) => {
        //   // e.preventDefault();
        //   // logger.trace('submit', e, other);
        //   handleSubmit(onSubmit);
        // }}
      >
        {/* <form onSubmit={handleSubmit(d => console.log(d))}> */}
        <ItemField
          name='name'
          label='名称'
          control={control}
          errors={errors}
          element={<Input></Input>}
          // element={Input}
        ></ItemField>
        <ItemField
          name='quantity'
          label='数量'
          control={control}
          errors={errors}
          element={<InputNumber></InputNumber>}
        ></ItemField>
        <ItemField
          name='content'
          label='描述'
          control={control}
          errors={errors}
          element={<Input.TextArea rows={4} />}
        ></ItemField>
        <ItemField
          name='isShow'
          label='是否显示'
          valuePropName='checked'
          control={control}
          errors={errors}
          element={<Switch checkedChildren='显示' unCheckedChildren='隐藏' />}
        ></ItemField>
        {/* <ItemField
        name='tagList'
        label='标签'
        control={control}
        errors={errors}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        element={<TagList value={[]} onChange={() => {}} />}
      ></ItemField> */}
        <ItemField
          name='tagList2'
          label='标签2'
          control={control}
          errors={errors}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          element={
            <Select
              mode='tags'
              style={{ width: '100%' }}
              placeholder='新建'
              onChange={selectedValue => {
                return selectedValue.map((item: string) => {
                  return { name: item, id: '' };
                });
              }}
              options={
                loading
                  ? []
                  : list.map(tag => {
                      return { value: tag, label: tag };
                    })
              }
            />
          }
        ></ItemField>
        <Button type='primary' htmlType='submit'>
          保存
        </Button>
      </form>
    </Spin>
  );
}

export default NewItemForm;
