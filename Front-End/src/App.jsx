import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Rgister/Register";
import Navbar from "./components/Admin/Navbar";
import { Officer } from "./components/Admin/Officers";
import { User } from "./components/Admin/Users";
import { Request } from "./components/Officer/Request";
import { Blacklist } from "./components/Officer/Blacklist";
import { Home } from "./components/User/Home";
import { Complaints } from "./components/User/complaints";
import { Suggetions } from "./components/User/suggetions";
import Rating from "./components/Officer/Rating";
import { Notification } from "./components/Officer/Notification";
import { UserNoti } from "./components/User/userNotification";
import { Nav } from "./components/Restuarent/Nav";
import { HotelMain } from "./components/Restuarent/HotelMain";
import { HotelFeedback } from "./components/Restuarent/Feedback";
import { HotelNotification } from "./components/Restuarent/HotelNotification";
import { UserProfile } from "./components/User/userProfile";
import { OffiFeedback } from "./components/Officer/officerFeedback";
import { Inspection } from "./components/Officer/inspection";
import { RequestRes } from "./components/Restuarent/RequestRes";
import { HotelInspection } from './components/Restuarent/hotelInspection';
import { Tasks } from './components/Admin/Tasks';
import { Action } from './components/Officer/Action';
import { Permissions } from './components/Admin/Permissions';
import { AdminNotification } from './components/Admin/AdminNotification';
import { useState } from 'react';
import { mycontext } from './components/Context/MyContext';
import { PaymentPage } from './components/Restuarent/payment';


function App() {

  const [email, setEmail] = useState('')
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [district, setDistrict] = useState('')
  const [amount, setAmount] = useState('')
  const valuse = { email, setEmail, id, setId, name, setName, district, setDistrict, amount, setAmount }
  return (
    <BrowserRouter>
      <mycontext.Provider value={valuse}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Navbar />} />
          <Route path="/officer" element={<Officer />} />
          <Route path="/user" element={<User />} />
          <Route path="/requests" element={< Request />} />
          <Route path="/blacklist" element={<Blacklist />} />
          <Route path="/home" element={<Home />} />
          <Route path="/complaints" element={< Complaints />} />
          <Route path="/suggetions" element={<Suggetions />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/userNoti" element={<UserNoti />} />
          <Route path="/hotel" element={<Nav />} />
          <Route path="/hotelMain" element={<HotelMain />} />
          <Route path="/hotelFeedback" element={<HotelFeedback />} />
          <Route path="/hotelNotification" element={<HotelNotification />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/officerFeedback" element={<OffiFeedback />} />
          <Route path="/inspection" element={<Inspection />} />
          <Route path="/requestres" element={<RequestRes />} />
          <Route path='/hotelInspection' element={<HotelInspection />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/action' element={<Action />} />
          <Route path='/permissions' element={<Permissions />} />
          <Route path='/adminNoti' element={<AdminNotification />} />
          <Route path='/payment' element={<PaymentPage />} />
        </Routes>
      </mycontext.Provider>
    </BrowserRouter>
  );
}

export default App;
