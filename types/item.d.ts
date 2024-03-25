interface ItemState {
  loading: boolean;
  totalCount: number;
  currentPage: number;
  currentPageSize: number;
  keyword: string;
  list: Item[];
  filterList: Item[];
}

interface ListPayload {
  totalCount: number;
  list: Item[];
}

interface Tag {
  name: string;
  id?: string;
}

interface TagState {
  loading: boolean;
  totalCount: number;
  list: string[];
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  content?: string;
  tagList?: string[];
  tagList2?: Tag[];
  isShow?: boolean;
  user: User;
}

// 替换掉 Item 类型中的Tag为string[]
type NewItem = Omit<Item, 'id' | 'user' | 'tagList2'> & { tagList2?: string[] };
type FormItem = Omit<Item, 'id' | 'user'>;
type NewFormItem = Omit<Item, 'id' | 'user' | 'tagList2'> & {
  tagList2?: string[];
};

interface User {
  username: string;
  id: string;
  items: string[];
}
