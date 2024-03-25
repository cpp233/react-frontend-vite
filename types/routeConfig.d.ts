interface RouteConfig {
  title: string;
  icon?: React.ReactNode;
  redirect?: string;
  hide?: boolean;
}

type ImportFile = () => Promise<unknown>;
interface autoRoutesType extends RouteConfig {
  path: string;
  // title: string;
  // icon?: IconContextProps;
  // redirect?: string;
  // hide?: boolean;
  element?: ImportFile;
  children?: autoRoutesType[];
}
