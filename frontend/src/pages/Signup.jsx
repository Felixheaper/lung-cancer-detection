import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { fetchUser } = useAuth()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        { name, email, password },
        { withCredentials: true }
      )
      await fetchUser()
      toast.success('Signup successful! Redirecting to upload page...')
      navigate('/upload')
    } catch (err) {
      toast.error('Signup failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen mx-110 flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Signup & Create a New Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup
