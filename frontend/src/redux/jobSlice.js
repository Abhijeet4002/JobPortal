import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    adminJobs: [],
    searchText: "",
  },
  reducers: {
    setAdminJobs: (state, action) => { state.adminJobs = action.payload || []; },
    setSearchJobByText: (state, action) => { state.searchText = action.payload || ""; },
  }
});

export const { setAdminJobs, setSearchJobByText } = jobSlice.actions;
export default jobSlice.reducer;
