import { createSlice } from '@reduxjs/toolkit'
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null,
}

if (localStorage.getItem('jwtToken')) {
    const { email, username, exp } = jwtDecode(localStorage.getItem('jwtToken'));

    if (exp * 1000 < Date.now()) { // *1000 to convert sec to millisec
        localStorage.removeItem('jwtToken');
    } else {
        initialState.user = {email, username};
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            localStorage.setItem('jwtToken', action.payload.token);
            state.user = action.payload
        },
        logout: (state) => {
            localStorage.removeItem('jwtToken');
            state.user = null;
        }
    },
})

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions

export default authSlice.reducer