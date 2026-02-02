/**
 * Root Reducer
 * Combines all Redux slices
 */

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
