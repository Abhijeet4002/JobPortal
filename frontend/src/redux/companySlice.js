import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
    searchText: "",
    singleCompany: {},
  },
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload || [];
    },
    setSearchCompanyByText: (state, action) => {
      state.searchText = action.payload || "";
    },
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload || {};
    },
  },
});

export const { setCompanies, setSearchCompanyByText, setSingleCompany } = companySlice.actions;
export default companySlice.reducer;
