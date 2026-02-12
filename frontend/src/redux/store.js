// Redux store setup (stub)
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { createTransform } from "redux-persist";
import authReducer from "./authSlice";
import companyReducer from "./companySlice";
import jobReducer from "./jobSlice";
import applicationReducer from "./applicationSlice";

// Strip transient state (loading) so it never gets persisted
const removeLoadingTransform = createTransform(
  // on save: strip loading
  (inbound) => ({ ...inbound, loading: false }),
  // on rehydrate: always start with loading = false
  (outbound) => ({ ...outbound, loading: false }),
  { whitelist: ["auth"] }
);

const rootReducer = combineReducers({
  auth: authReducer,
  company: companyReducer,
  job: jobReducer,
  application: applicationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [removeLoadingTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export default store;
