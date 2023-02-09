export enum SortPropertyEnum {
    DATE_DESC = 'date',
    DATE_ASC = '-date',
    AUTHOR_DESC = 'author',
    AUTHOR_ASC = '-author',
  }
  
  export type Sort = {
    name: string;
    sortProperty: SortPropertyEnum;
  };
  
  export interface FilterSliceState {
    SearchText: string;
    SearchAuthor: string;
    SortProperty: SortPropertyEnum,
    page : number,

  }