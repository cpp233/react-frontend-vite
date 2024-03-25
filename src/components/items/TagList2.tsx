import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@hooks/reduxHook';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

import logger from '@utils/logger';

interface PropsType {
  value: Tag[];
  onChange: (newValue: Tag[]) => void;
}

function TagList2(
  props: PropsType,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { loading, list } = useAppSelector(state => {
    return state.tags;
  });

  const { value, onChange } = props;
  // const [options, setOptions] = useState<SelectProps['options']>([]);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  useEffect(() => {
    if (!value) {
      return;
    }

    const options = value?.map(item => {
      return { label: item.name, value: item.name, id: item.id };
    });
    // setOptions(options);
    const defaultValue = value?.map(item => {
      return item.name;
    });
    setSelectedValue(defaultValue);

    // if (defaultValue?.length > 1) {
    //   onChange(
    //     defaultValue.map(item => {
    //       return { name: item, id: '' };
    //     })
    //   );
    // }
    // logger.trace('TagList2 useEffect', { value, options, defaultValue });
  }, [value]);

  const handleOnChange: SelectProps['onChange'] = selectedValue => {
    setSelectedValue(selectedValue);
    onChange(
      selectedValue.map((item: string) => {
        return { name: item, id: '' };
      })
    );
  };

  return (
    <Select
      mode='tags'
      style={{ width: '100%' }}
      placeholder='等待输入'
      // tagRender={props => {
      //   const { label, value, closable, onClose } = props;
      //   logger.info('tagRender', props);
      //   const onPreventMouseDown = (
      //     event: React.MouseEvent<HTMLSpanElement>
      //   ) => {
      //     event.preventDefault();
      //     event.stopPropagation();
      //   };
      //   return (
      //     <Tag
      //       key={value}
      //       color={value}
      //       onMouseDown={onPreventMouseDown}
      //       closable={closable}
      //       onClose={onClose}
      //       style={{ marginRight: 3 }}
      //     >
      //       {label}
      //     </Tag>
      //   );
      // }}
      onChange={handleOnChange}
      options={
        loading
          ? []
          : list.map(tag => {
              return { value: tag, label: tag };
            })
      }
      // 太抽象了，选中要用 value， defaultValue 不和这个 mod
      // defaultValue={defaultValue}
      value={selectedValue}

      // optionRender={options => {
      //   logger.info('tagList2 optionRender', options);
      //   return (
      //     <Select.Option key={2} value={2}>
      //       {2}
      //     </Select.Option>
      //   );
      // }}
    >
      {/* {value?.map(tag => {
        logger.info('tagList2', tag);
        // return { label: tag.name, value: tag.name };
        return (
          <Select.Option selected={true} key={tag.name} value={tag.name}>
            {tag.name}
          </Select.Option>
        );
      })} */}
    </Select>
  );
}

export default React.forwardRef(TagList2);
