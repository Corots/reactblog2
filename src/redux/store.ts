import { configureStore } from '@reduxjs/toolkit';
import filter from './filter/slice';
import { useDispatch } from 'react-redux';

import commentFiler from './comments/slice';
import favoriteFiler from './favorite/slice';


export const store = configureStore({
    reducer: {
      filter,
      commentFiler,
      favoriteFiler
    },
  });

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();