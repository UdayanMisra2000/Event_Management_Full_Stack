import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from "./Pages/Layout";
import Register1 from './Pages/Register1'
import Register2 from './Pages/Register2'
import EventPage from './Pages/EventPage'
import EventPage1 from './Pages/EventPage1'
import EventPage2 from './Pages/EventPage2'
import BookingPage from './Pages/BookingPage'
import Availability from './Pages/Availability'
import Login from './Pages/Login'
import Home from './Pages/HomePage'
import UpdateUserPage from './Pages/UpdateUserPage';
import UpdateEventPage from './Pages/UpdateEventPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register1/>} />
        <Route path = "/register/:id/:email" element={<Register2/>} />
        <Route path="/user" element={<Layout />}>
          <Route path='event' element={<EventPage/>} />
          <Route path='create-event' element={<EventPage1/>} />
          <Route path='update-event/:id' element={<UpdateEventPage/>} />
          <Route path='create-event/:id' element={<EventPage2/>} />
          <Route path='book-event' element={<BookingPage/>} />
          <Route path='availability' element={<Availability/>} />
          <Route path='settings' element={<UpdateUserPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
