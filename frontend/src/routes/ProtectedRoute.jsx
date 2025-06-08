import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
          withCredentials: true,
        })
        console.log("✅ Authenticated user:", res.data)
        setAuthenticated(true)
      } catch (err) {
        console.warn("❌ Auth check failed:", err?.response?.data || err.message)
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Checking authentication...</div>
  }

  return authenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute
