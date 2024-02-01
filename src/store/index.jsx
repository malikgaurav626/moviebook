import { configureStore, createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentRoute: 0,
    searchInput: "",
    movieData: [],
}


const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setCurrentRoute(state, action) {
            state.currentRoute = action.payload
        },
        setSearchInput(state, action) {
            state.searchInput = action.payload
        },
        setMovieData(state, action) {
            state.movieData = action.payload
        }
    }
});


const store = configureStore({

    reducer: dataSlice.reducer
})



export const {setCurrentRoute, setSearchInput, setMovieData} = dataSlice.actions;
export default store;