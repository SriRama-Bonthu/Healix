import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import Login from "./pages/Login";

import Register from "./pages/Register";

import PatientDashboard from "./pages/PatientDashboard";

import DoctorDashboard from "./pages/DoctorDashboard";

import Doctors from "./pages/Doctors";

import BookAppointment from "./pages/BookAppointment";

import VideoConsultation from "./pages/VideoConsultation";

import DoctorProfile from "./pages/DoctorProfile";

import CreatePrescription from "./pages/CreatePrescription";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/patient" element={<PatientDashboard />} />

        <Route path="/doctor" element={<DoctorDashboard />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route path="/book/:doctorId" element={<BookAppointment />} />

        <Route path="/doctor-profile/:doctorId" element={<DoctorProfile />} />

        <Route
          path="/prescription/:appointmentId"
          element={<CreatePrescription />}
        />

        <Route
          path="/consultation/:appointmentId/:roomId"
          element={<VideoConsultation />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
