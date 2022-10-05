import { configureStore } from '@reduxjs/toolkit'
import optionsSlice from './optionsSlice'

export const store = configureStore({
  reducer: {
    options: optionsSlice,
  },
})