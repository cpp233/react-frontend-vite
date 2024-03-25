import React from 'react';
import { Card, List, Typography, Button, Badge } from 'antd';

import { useAppSelector, useAppDispatch } from '@hooks/reduxHook';
import {
  readAllNoticeAction,
  readOneNoticeAction,
} from '@redux/actions/noticeAction';

const Notices = () => {
  const dispatch = useAppDispatch();
  const notices = useAppSelector(state => {
    return state.notices;
  });

  return (
    <Card
      title='通知中心'
      extra={
        <Button
          size='small'
          onClick={() => {
            dispatch(readAllNoticeAction());
          }}
        >
          全部已读
        </Button>
      }
    >
      <List
        bordered
        dataSource={notices}
        renderItem={item => (
          <List.Item
            style={{
              display: 'flex,',
              alignContent: 'space-between',
            }}
          >
            <div>
              <Typography.Text mark>[ITEM]</Typography.Text> {item.notice}
            </div>

            <Badge dot={!item.isRead}>
              <Button
                size='small'
                onClick={() => {
                  dispatch(readOneNoticeAction(item));
                }}
              >
                已读
              </Button>
            </Badge>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Notices;
