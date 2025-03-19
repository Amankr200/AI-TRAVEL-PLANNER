import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import Header from './assets/components/custom/Header.jsx'
import CreateTrip from './create-trip/index.jsx'

const router=createBrowserRouter([
  {
path:'/',
element:<App/>
},
{
  path:'/create-trip',
  element:<CreateTrip/>
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
