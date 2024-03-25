import React, { useState, useEffect, useId } from 'react';
import { Tag, TagProps } from 'antd';
import { stringToColor as _, getColor } from '@utils/utils';

interface Props extends TagProps {
  tag: string;
}

function MyTagComponent({ tag, ...baseProps }: Props) {
  const [color, setColor] = useState<string>('');
  const id = useId();

  useEffect(() => {
    getColor(tag).then(color => {
      setColor(color);
    });
  }, []);

  return color !== '' ? (
    <Tag key={id} color={color} style={{ marginRight: 3 }} {...baseProps}>
      {tag}
    </Tag>
  ) : (
    <></>
  );
}

export default MyTagComponent;
