
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Upload from './pages/Upload'
import About from './pages/About'
import Feedback from './pages/Feedback'
import PositiveResult from './pages/PositiveResult'
import NegativeResult from './pages/NegativeResult'
import DoctorSelect from './pages/DoctorSelect'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoute'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext' // ✅ NEW import

function App() {
  return (
    <AuthProvider>
      <div className="pt-20 min-h-screen bg-white">
        {/* Navbar shown on all pages */}
        <Navbar />

        {/* Main App Routing */}
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/positive" element={<ProtectedRoute><PositiveResult /></ProtectedRoute>} />
          <Route path="/negative" element={<ProtectedRoute><NegativeResult /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><DoctorSelect /></ProtectedRoute>} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        {/* Toast Notifications (top-right corner) */}
        <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />
      </div>
    </AuthProvider>
  )
}

export default App
