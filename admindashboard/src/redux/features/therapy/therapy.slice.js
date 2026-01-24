// import { createSlice } from "@reduxjs/toolkit" ;
// import  { createTherapy, getAllTherapies } from "./therapy.thunk";


// const initialState = {
//     allTherapies: [],
//     therapies: null,
//     status: "idle", 
//     error: null,
// }

// const therapySlice = createSlice({
//     name: "therapy",
//     initialState,
//     reducers: {
//         clearTherapyError(state) {
//             state.error = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//         .addCase(createTherapy.pending, (state) => {
//             state.status = "loading";
//         })
//         .addCase(createTherapy.fulfilled, (state, action) => {
//             state.status = "succeeded";
//             state.therapies = action.payload;
//         })
//         .addCase(createTherapy.rejected, (state, action) => {
//             state.status = "failed";
//             state.error = action.payload;
//         })
//         .addCase(getAllTherapies.pending, (state) => {
//             state.status = "loading";
//         })
//         .addCase(getAllTherapies.fulfilled, (state, action) => {
//             state.status = "succeeded";
//             state.allTherapies = action.payload;
//         })
//         .addCase(getAllTherapies.rejected, (state, action) => {
//             state.status = "failed";
//             state.error = action.payload;
//         })
//     }
// })

// export const { clearTherapyError } = therapySlice.actions;
// export default therapySlice.reducer;