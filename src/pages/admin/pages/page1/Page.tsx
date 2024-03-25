import React from 'react';

function Page1() {
  throw new Error('自定义错误');
  return <div>Page1</div>;
}

export default Page1;
