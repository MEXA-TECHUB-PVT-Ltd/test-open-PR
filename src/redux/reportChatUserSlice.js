import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../configs/makeRequest";

export const reportUser = createAsyncThunk(
    'reportChatUser/reportUser',
    async (payload, { getState, rejectWithValue }) => {
        try {
            console.log(payload)
            const { token } = getState().userLogin;
            const data = await makeRequest('POST', `/users/report/user`, JSON.stringify(payload), null, null);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const reportChatUserSlice = createSlice({
    name: 'reportChatUser',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(reportUser.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(reportUser.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(reportUser.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default reportChatUserSlice.reducer;


