import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import listingsSlice from './slices/listingsSlice';
import carsSlice from './slices/carsSlice';
import locationsSlice from './slices/locationsSlice';
import messagesSlice from './slices/messagesSlice';
import notificationsSlice from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    listings: listingsSlice,
    cars: carsSlice,
    locations: locationsSlice,
    messages: messagesSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;