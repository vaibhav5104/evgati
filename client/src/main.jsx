import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './hooks/useAuth';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import './index.css';
import {App} from './App';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={googleClientId}>
    <AuthProvider>
      <StrictMode>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="toast-container"
          bodyClassName="toast-body"
          style={{
            fontSize: '14px',
          }}
        />
      </StrictMode>
      </AuthProvider>
    </GoogleOAuthProvider>
);
