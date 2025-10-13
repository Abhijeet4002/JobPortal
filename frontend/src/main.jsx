import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import axios from 'axios'

const persistor = persistStore(store);

// Always send cookies with axios requests (needed for JWT cookie auth)
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
  <App />
  <Toaster richColors position="top-center" />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)