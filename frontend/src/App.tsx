import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import MyBookings from "./pages/MyBookings";
import Wishlist from "./pages/Wishlist";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path='/add-property' element={<AddProperty />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
      </main>
    </div>
  );
};

export default App;