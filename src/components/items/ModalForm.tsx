import React from 'react';
import { Modal } from 'antd';
import NewItemForm from '@components/items/NewItemForm';

interface PropsType {
  isOpen: boolean;
  handleCancel: () => void;
}

const ModalForm = ({ isOpen, handleCancel }: PropsType) => {
  return (
    <Modal
      title='新建'
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={false}
    >
      <NewItemForm></NewItemForm>
    </Modal>
  );
};

export default ModalForm;
