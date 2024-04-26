import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  isLoggedIn: boolean,
  username: any,
  userId: any,
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: '',
  userId: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: {
      payload: {
        username: any,
        userId: string,
      },
    }) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
  
 
    logout: state => {
      state.isLoggedIn = false;
    },
    updateUsername: (state, action: {
      payload: string
    }) => {
      state.username = action.payload;
    },
  }
})

export const { login, logout, updateUsername } = authSlice.actions

export default authSlice.reducer