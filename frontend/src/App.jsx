import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public pages
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import About from "./pages/public/About";


// Parent pages
import ParentDashboard from "./pages/parent/Dashboard";
import Caregivers from "./pages/parent/Caregivers";
import BookCaregiver from "./pages/parent/BookCaregiver";
import ParentBookings from "./pages/parent/Bookings";

// Caregiver pages
import CaregiverDashboard from "./pages/caregiver/Dashboard";
import CaregiverBookings from "./pages/caregiver/Bookings";
import CaregiverProfile from "./pages/caregiver/profile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* ================= PARENT ================= */}

        <Route element={<ProtectedRoute allowedRoles={["PARENT"]} />}>
          <Route
            path="/parent/dashboard"
            element={<ParentDashboard />}
          />

          <Route
            path="/parent/caregivers"
            element={<Caregivers />}
          />

          <Route
            path="/parent/book/:caregiverId"
            element={<BookCaregiver />}
          />

          <Route
            path="/parent/bookings"
            element={<ParentBookings />}
          />
        </Route>


        {/* ================= CAREGIVER ================= */}

        <Route element={<ProtectedRoute allowedRoles={["CAREGIVER"]} />}>
          <Route
            path="/caregiver/dashboard"
            element={<CaregiverDashboard />}
          />

          <Route
            path="/caregiver/bookings"
            element={<CaregiverBookings />}
          />

          <Route
            path="/caregiver/profile"
            element={<CaregiverProfile />}
          />
        </Route>


        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;