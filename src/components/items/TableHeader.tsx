import React, { useState, useCallback } from 'react';
import { Col, Row, Input, Select, Space, Button, Popconfirm } from 'antd';
// import type { SearchProps } from 'antd/es/input';
import type { SearchProps, InputProps } from 'antd/lib/input';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import { useAppSelector, useAppDispatch } from '@hooks/reduxHook';
import {
  getItemListAction,
  filterItemListAction,
  createOneItemAction,
  delItemListAction,
  updateKeywordAction,
  setPageAction,
} from '@redux/actions/itemAction';

import ToggleInput from '@components/items/ToggleInput';
import ModalForm from '@components/items/ModalForm';

import logger from '@utils/logger';
import { getEnv } from '@utils/utils';

const g_env = getEnv();
let getFakerData: () => never | NewItem = () => {
  throw new Error('do not work with !development');
};

if (process.env.NODE_ENV === 'development') {
  import('@utils/fakerData').then(faker => {
    getFakerData = faker.getFakerData;
  });
}
// if (g_env.MODE === 'development') {
//   import('@utils/fakerData').then(faker => {
//     getFakerData = faker.getFakerData;
//   });
// }
// import { getFakerData } from '@utils/fakerData';

interface PropsType {
  selectedRowKeys: React.Key[];
  // currentPage: number;
  // currentPageSize: number;
  // setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const TableHeader = ({
  selectedRowKeys,
}: // currentPage,
// currentPageSize,
// setCurrentPage,
PropsType) => {
  const dispatch = useAppDispatch();
  const { currentPage, currentPageSize } = useAppSelector(state => state.items);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleShowModal = () => {
    setIsOpen(true);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleCreateFakerData = () => {
    const fakerData = getFakerData();
    logger.info('fakerData', fakerData);
    dispatch(createOneItemAction(fakerData));
  };

  const handleDeleteList = () => {
    dispatch(
      delItemListAction({
        selectedRowKeys,
        page: currentPage,
        per: currentPageSize,
      })
    );
  };

  const handleSearch = useCallback(
    debounce<NonNullable<InputProps['onChange']>>(e => {
      const keyword = e.target.value;
      dispatch(updateKeywordAction(keyword));
      dispatch(filterItemListAction());

      // dispatch(filterItemListAction(keyword));
      // dispatch(getItemListAction({ page: 1, per: currentPageSize, keyword }));
    }, 250),
    []
  );

  const handleSearch_old = useCallback(
    debounce<NonNullable<SearchProps['onSearch']>>((value, e) => {
      const keywork = value;
      if (keywork === '') {
        // logger.trace({ value, e });
      }
    }, 250),
    []
  );

  const handleSearchCurrentPage = useCallback(
    throttle<NonNullable<InputProps['onChange']>>(e => {
      const keyword = e.target.value;
      logger.trace('搜索当前页', keyword);
      dispatch(updateKeywordAction(keyword));
      dispatch(filterItemListAction());
    }, 250),
    []
  );
  const handleSearchAll = useCallback(
    throttle<NonNullable<InputProps['onChange']>>(e => {
      const keyword = e.target.value;
      logger.trace('搜索全部', keyword);
      dispatch(setPageAction(1));
      dispatch(getItemListAction({ page: 1, per: currentPageSize, keyword }));
      dispatch(updateKeywordAction(keyword));
      // dispatch(filterItemListAction());
    }, 250),
    []
  );

  return (
    <Row>
      <Col span={8}>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type='primary'
            size='large'
            shape='circle'
            icon={<PlusOutlined />}
            onClick={handleShowModal}
          ></Button>
          <Popconfirm
            title='确定删除？'
            onConfirm={handleDeleteList}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okText='确定'
            cancelText='取消'
          >
            <Button>删除</Button>
          </Popconfirm>
          {g_env.MODE === 'development' && (
            <Button onClick={handleCreateFakerData}>新增(假数据)</Button>
          )}
        </Space>
      </Col>

      <Col span={8} offset={8}>
        <Space>
          {false && (
            <Input.Search
              // addonBefore={<Select></Select>}
              placeholder='当前页搜索'
              allowClear
              onChange={handleSearch}
              // value={keyword}
              // onSearch={handleSearch} // 废弃，改用 onChange 可以少一个按键操作
            ></Input.Search>
          )}
          <ToggleInput
            handleGroup={[
              {
                type: 'current',
                label: '当前页',
                placeholder: '搜索当前页',
                handle: handleSearchCurrentPage,
              },
              {
                type: 'all',
                label: '全部',
                placeholder: '搜索全部',
                handle: handleSearchAll,
              },
            ]}
          ></ToggleInput>
        </Space>
      </Col>

      <ModalForm isOpen={isOpen} handleCancel={handleCancel}></ModalForm>
    </Row>
  );
};

export default TableHeader;
// export default React.memo(TableHeader);
