// import { type IconContextProps } from '@ant-design/icons';
// import { type FunctionComponent /*, FC */ } from 'react';

type ImportFile = () => Promise<unknown>;

interface routesMapType {
  path: string;
  title: string;
  hide?: boolean;
  index?: boolean;
  icon?: IconContextProps;
  redirect?: string;
  element?: React.ReactNode;
  // children?: Omit<routesMapType, 'children'>[];
  children?: routesMapType[];
}
