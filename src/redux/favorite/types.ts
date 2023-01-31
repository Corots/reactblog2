// export enum SortPropertyEnum {
//     POPULARITY = 'Popular',
//     DATE = 'Latest'
//   }
  
//   export type Sort = {
//     name: string;
//     sortProperty: SortPropertyEnum;
//   };
  
  export interface FavoriteSliceState {
    idFavorites : string[]
    idBookmarks : string[]
  }