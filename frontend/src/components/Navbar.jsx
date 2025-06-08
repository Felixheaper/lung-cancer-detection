import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center w-full fixed top-0 left-0 z-50 shadow">
      <h1 className="text-xl font-bold">RELIFE-Lung Cancer Detection Platform</h1>

      <div className="space-x-4">
     
      
        {user ? (
          <>
              <Link to="/" className="hover:underline"> HOME </Link>
            <span className="text-xl text-gray-500"> Welcome !!! {user.name || 'User'}</span>
            <button onClick={handleLogout} className="hover:underline text-red-500">
              Logout
            </button>
          </>
        ) : (
          <>
              <Link to="/upload" className="hover:underline text-2xl"> Explore </Link>
            <Link to="/login" className="hover:underline text-2xl">Login</Link>
            <Link to="/signup" className="hover:underline text-2xl">Signup</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

