/**
 * Root Reducer
 * Combines all Redux slices
 */

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';

const rootReducer = combineReducers({
  // SSOT ownership: Redux is reserved for auth/session domain only.
  // Workspace context must live in Zustand (`useWorkspaceStore`) to avoid dual source of truth.
  auth: authReducer,
  // Add only truly global cross-domain reducers here.
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
