// export enum SortPropertyEnum {
//     POPULARITY = 'Popular',
//     DATE = 'Latest'
//   }
  
//   export type Sort = {
//     name: string;
//     sortProperty: SortPropertyEnum;
//   };
  
  export interface FavoriteSliceState {
    logged : boolean
    img? : string
    name? : string
    idFavorites : number[]
    idBookmarks : number[]
  }


  export interface ILoginInfo {
    img : string
    name : string
  }



  export interface IUserInfo {
    id: number;
    username: string;
    img: string;
    idFavorites: number[];
    idBookmarks: number[];
  }
  
  export interface Article {
    id: number;
    title: string;
    text: string;
    date: string;
    author_id: number;
  }