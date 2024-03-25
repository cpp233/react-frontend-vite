import React, { useEffect, useState, useCallback } from 'react';
import { Input, Select } from 'antd';
import type { SearchProps, InputProps } from 'antd/lib/input';
import debounce from 'lodash/debounce';

import logger from '@utils/logger';

interface HandleGroup {
  type: string;
  label: string;
  placeholder: string;
  handle: InputProps['onChange'];
}

const ToggleInput = ({ handleGroup }: { handleGroup: HandleGroup[] }) => {
  const [currentType, setCurrentType] = useState<string>(
    handleGroup.at(0)?.type || ''
  );

  const handleChange = (value: string) => {
    // logger.trace(`selected ${value}`);
    const newType = handleGroup.find(item => item.type === value)?.type;
    newType && setCurrentType(newType);
  };

  const handleSearch = useCallback(
    debounce<NonNullable<InputProps['onChange']>>(e => {
      // logger.trace('onChange', {
      //   e,
      //   keyword,
      //   currentType,
      // });
      const handle = handleGroup.find(item => {
        return item.type == currentType;
      })?.handle;

      handle && handle(e);
    }, 250),
    [currentType]
  );

  return (
    <Input.Search
      addonBefore={
        <Select
          // dropdownMatchSelectWidth={false}
          popupMatchSelectWidth={false}
          onChange={handleChange}
          options={handleGroup?.map(item => {
            return { value: item.type, label: item.label };
          })}
          defaultValue={handleGroup.at(0)?.label}
        ></Select>
      }
      placeholder={
        handleGroup.find(item => item.type == currentType)?.placeholder
      }
      allowClear
      onChange={handleSearch}
      // value={keyword}
      // onSearch={handleSearch} // 废弃，改用 onChange 可以少一个按键操作
    ></Input.Search>
  );
};

export default ToggleInput;
