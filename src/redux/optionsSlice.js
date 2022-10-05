import { createSlice } from '@reduxjs/toolkit'

export const optionsSlice = createSlice({
  name: 'options',
  initialState: {
    majormains: [],
    map: [],
    search: null,
    api_token: localStorage.getItem('api_token'),
  },
  reducers: {
    setMajormains: (state, action) => {
      state.majormains = action.payload;
    },

    setMap: (state, action) => {
      if(state.map.length)
      state.map = state.map.slice(0, action.payload.index);
      state.map[action.payload.index] = action.payload.title;
    },

    setMapBack: (state) => {
      const Map = state.map;
      state.map = Map.slice(0, -1);
    },

    setSearch: (state, action) => {
      state.search = action.payload;
    },

    setToken: (state, action) => {
      state.api_token = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMajormains, setMap, setMapBack, setSearch, setToken } = optionsSlice.actions;
export const majormains = store => store.options.majormains;
export const map = store => store.options.map;
export const search = store => store.options.search;
export const api_token = store => store.options.api_token;
export default optionsSlice.reducer