// getAllCoachesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { BASE_URL } from '../../configs/apiUrl';
const initialState = {
    coaches: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    hasMore: true,
};

export const fetchCoaches = createAsyncThunk(
    'getAllCoaches/fetchCoaches',
    async (options, { getState, rejectWithValue }) => {
        try {
            const { currentPage } = getState().getAllCoaches;
            const response = await fetch(`${BASE_URL}/users/getAllByCoachArea?pageSize=${options.pageSize}&page=${currentPage}`);
            if (!response.ok) {
                throw new Error('Failed to fetch coaches');
            }
            const coaches = await response.json();
            return coaches;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// export const fetchCoaches = createAsyncThunk(
//     'getAllCoaches/fetchCoaches',
//     async (options, { getState, rejectWithValue }) => {
//         try {
//             const { currentPage } = getState().getAllCoaches;
//             const data = makeRequest('GET', `/users/getAllByCoachArea?pageSize=${options.pageSize}&page=${currentPage}`,null,null)
//             return data;
//         } catch (error) {
//             return error;
//         }
//     }
// );

const getAllCoachesSlice = createSlice({
    name: 'getAllCoaches',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoaches.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCoaches.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const newCoaches = Array.isArray(action.payload) ? action.payload : [];
                state.coaches =  state.coaches.concat(action.payload.result);
                state.currentPage += 1;
                state.hasMore = newCoaches.length > 0; // If no more data, set hasMore to false
                state.error = null;
            })
            .addCase(fetchCoaches.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default getAllCoachesSlice.reducer;
