import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './assets/components/custom/Header.jsx';
import CreateTrip from './create-trip/index.jsx';
import TripDetails from './create-trip/TripDetails.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />,
  },
  {
    path: '/trip-details',
    element: <TripDetails />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router}>
        <Header />
      </RouterProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
