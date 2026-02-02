/**
 * Redux Store Configuration
 * Module 1: Identity and Access Management
 */

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import authMiddleware from './middleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
