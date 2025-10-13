import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: {},
    applied: [],
  },
  reducers: {
    setAllApplicants: (state, action) => { state.applicants = action.payload || {}; },
    setAppliedJobs: (state, action) => { state.applied = action.payload || []; },
  }
});

export const { setAllApplicants, setAppliedJobs } = applicationSlice.actions;
export default applicationSlice.reducer;
