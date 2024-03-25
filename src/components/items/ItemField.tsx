import React, { ReactNode, ComponentType } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Form, Input, InputNumber, Button } from 'antd';
import { ButtonProps, InputProps, InputNumberProps } from 'antd';
import logger from '@utils/logger';

// type AntdComponentProps = InputProps;
// type AntdComponent = ComponentType<AntdComponentProps>;
// type AntdComponent = (props: AntdComponentProps) => JSX.Element;

interface PropsType {
  name: keyof NewFormItem;
  label: string;
  valuePropName?: string;
  control: Control<NewFormItem>;
  errors: FieldErrors<NewFormItem>;
  element: JSX.Element;
  // element: React.ForwardRefExoticComponent<
  //   any & React.RefAttributes<HTMLElement>
  // >;
}

function ItemField({
  name,
  label,
  valuePropName,
  control,
  errors,
  element: Element,
}: PropsType) {
  const errorDetail = (
    errors: FieldErrors<NewFormItem>,
    // <NewFormItem>,
    name: keyof NewFormItem,
    message: string
  ) => {
    return (
      errors[name] && (
        <div className='ant-form-item-explain-error'>{message}</div>
      )
    );
  };

  // logger.trace(`${name} 错误是否存在:`, errors[name]);

  return (
    <>
      {/* <input {...register('name')}></input> */}
      <Form.Item
        colon={false}
        label={label}
        valuePropName={valuePropName ? valuePropName : undefined}
        validateStatus={errors[name] ? 'error' : 'success'}
        help={errors[name] ? errors[name]?.message : null}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            // logger.trace(field);
            const { value, ...other } = field;
            const newField = {
              ...other,
              ...(!valuePropName && { value }),
            };
            return (
              <>
                {/* <Input {...field} /> */}

                {/* working */}
                {Element &&
                  React.cloneElement(Element, {
                    ...newField,
                    // ...field,
                    // value: valuePropName ? valuePropName : undefined,
                  })}
                {/* {Element && <Element {...newField}></Element>} */}
                {/* not working */}
                {/* {element({ ...field })} */}
                {/* {React.createElement(element, field)} */}
                {/* <Input onChange={field.onChange} value={field.value} /> */}
                {/* <ErrorMessage
                  errors={errors}
                  name='name'
                  render={props => (
                    <span className='ant-form-item-explain-error'>
                      {props.message}
                    </span>
                  )}
                /> */}
              </>
            );
          }}
        />
      </Form.Item>
      {/* <input {...register('name')} />
      {errors.name && <span>errors.name.message</span>} */}
    </>
  );
}

export default ItemField;
