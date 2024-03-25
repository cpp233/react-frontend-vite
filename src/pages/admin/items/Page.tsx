import React, { useEffect, useCallback, useState, useId } from 'react';
import { Table, Divider, Space, Button, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TableHeader from '@components/items/TableHeader';
import MyTagComponent from '@components/items/MyTagComponent';

import { useAppSelector, useAppDispatch } from '@hooks/reduxHook';
import {
  setPageAction,
  setPageSizeAction,
  getItemListAction,
  delItemListAction,
} from '@redux/actions/itemAction';
import { getTagListAction } from '@redux/actions/tagAction';

import logger from '@utils/logger';
import './Table.css';

// TODO
const helper_generateItemFields = () => {
  // field dataIndex
  // title
  // width
  // render (text, record)=></>
  // sorter (a, b) => Number(a.count) - Number(b.count),
};

type DataType = Omit<Item, 'user'>;

function ItemTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const [currentPageSize, setCurrentPageSize] = useState<number>(15);
  const dispatch = useAppDispatch();
  const {
    currentPage,
    currentPageSize,
    loading,
    totalCount,
    keyword,
    list,
    filterList,
  } = useAppSelector(state => {
    return state.items;
  });
  const location = useLocation();
  const navigate = useNavigate();
  // const params = useParams();

  useEffect(() => {
    dispatch(getItemListAction({ page: currentPage, per: currentPageSize }));
    // 首次进入页面，获取 tag
    dispatch(getTagListAction());
  }, [dispatch]);

  // logger.trace({ location, navigate, params });
  // logger.trace('ItemTable', {
  //   loading,
  //   totalCount,
  //   keyword,
  //   list,
  //   filterList,
  //   currentPageSize,
  // });

  const handleDeleteItem = (id: React.Key) => {
    dispatch(
      delItemListAction({
        selectedRowKeys: [id],
        page: currentPage,
        per: currentPageSize,
      })
    );
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      key: 'id',
      width: 65,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: '5%',
    },
    {
      title: '描述',
      dataIndex: 'content',
      width: '20%',
      ellipsis: true,
    },
    // {
    //   title: 'tags',
    //   dataIndex: 'tagList',
    //   width: '15%',
    //   render: (text, { tagList }) =>
    //     tagList?.map(tag => {
    //       return <MyTagComponent key={tag} tag={tag}></MyTagComponent>;
    //     }),
    // },
    {
      title: '标签',
      dataIndex: 'tagList2',
      width: '15%',
      render: (text, { tagList2 }) =>
        tagList2?.map(tag => {
          // const id = useId();
          return (
            <MyTagComponent key={tag.name} tag={tag.name}></MyTagComponent>
          );
        }),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button
            onClick={() => {
              navigate(`${location.pathname}/${record.id}`);
            }}
          >
            修改
          </Button>
          <Popconfirm
            title='确定删除？'
            onConfirm={() => {
              handleDeleteItem(record.id);
            }}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okText='确定'
            cancelText='取消'
          >
            <Button>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableHeader
        selectedRowKeys={selectedRowKeys}
        // currentPage={currentPage}
        // currentPageSize={currentPageSize}
        // setCurrentPage={setCurrentPage}
      ></TableHeader>
      <Divider />

      <Table
        // components={components}
        rowClassName={record =>
          record.isShow ? '' : 'item-form-item-no-focus'
        }
        bordered
        loading={loading}
        columns={columns}
        // dataSource={filterList || list}
        dataSource={filterList}
        rowKey={record => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange(selectedRowKeys, selectedRows, info) {
            // logger.trace({ selectedRowKeys, selectedRows, info });
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        pagination={{
          current: currentPage,
          showSizeChanger: true,
          total: totalCount,
          defaultCurrent: currentPage,
          defaultPageSize: currentPageSize,
          pageSizeOptions: [10, 15, 20, 50],
          onChange: (page, pageSize) => {
            // 留给后端
            logger.info(page, pageSize);
            // setCurrentPage(page);
            // setCurrentPageSize(pageSize);
            dispatch(setPageAction(page));
            dispatch(setPageSizeAction(pageSize));
            dispatch(getItemListAction({ page: page, per: pageSize }));
          },
          // defaultCurrent: 1,
          // defaultPageSize: 20,
        }}
      ></Table>
    </>
  );
}

export default ItemTable;
