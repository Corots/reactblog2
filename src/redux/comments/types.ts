export enum SortPropertyEnum {
    POPULARITY = 'Popular',
    DATE = 'Latest'
  }
  
  export type Sort = {
    name: string;
    sortProperty: SortPropertyEnum;
  };
  
  export interface CommentSliceState {
    SortProperty: SortPropertyEnum,
  }