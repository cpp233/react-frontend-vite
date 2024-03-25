import React, { useEffect, useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Space, Tag, Input } from 'antd';
import type { InputRef } from 'antd';

import MyTagComponent from '@components/items/MyTagComponent';
// import { stringToColor, getColor } from '@utils/utils';
import logger from '@utils/logger';

interface PropsType {
  value: string[];
  onChange: (newValue: string[]) => void;
}

const TagList = (
  props: PropsType,
  _ref: React.ForwardedRef<HTMLInputElement>
) => {
  // const form = Form.useFormInstance();
  // logger.trace({ props, _ref });
  const { value: tags, onChange } = props;
  // const { status } = Form.Item.useStatus();

  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<InputRef>(null);

  // logger.trace({ tags, onChange });

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
    if (!tags) {
      // form.setFieldValue('tagList', []);
      onChange([]);
    }
  }, [inputVisible]);

  const handleShowInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue === '') {
      setInputVisible(false);
      return;
    }

    const newTags = [...tags, inputValue];
    onChange(newTags);

    setInputVisible(false);
    setInputValue('');
  };

  const handleClose = (tag: string) => {
    logger.trace(tag);
    const newTags = tags.filter(item => item !== tag);
    onChange(newTags);

    // logger.trace(form.getFieldValue('tagList'));
    // form.setFieldsValue({})}
    // form.setFieldValue('tagList', newTags);
  };

  return (
    <Space>
      {tags?.map(tag => {
        return (
          <MyTagComponent
            closable
            key={tag}
            tag={tag}
            // color={getColor(tag)}
            style={{ marginRight: 3 }}
            onClose={() => handleClose(tag)}
          >
            {tag}
          </MyTagComponent>
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type='text'
          size='small'
          // style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag style={{ borderStyle: 'dashed' }} onClick={handleShowInput}>
          <PlusOutlined /> 新建 Tag
        </Tag>
      )}
    </Space>
  );
};

export default React.forwardRef(TagList);
