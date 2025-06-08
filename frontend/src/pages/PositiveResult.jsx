import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function PositiveResult() {
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  const handleFindDoctors = async () => {
    if (!location) {
      toast.error('Please enter your location')
      return
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/select-doctor`, { location })
      navigate('/doctors', { state: { location } })
    } catch (err) {
      toast.error('Could not fetch doctors')
    }
  }

  return (
    <div className="p-8 pt-20 max-w-2xl mx-80">
      <h2 className="text-3xl font-bold mb-4 text-red-600">Potential Lung Cancer Detected</h2>
      <p className="mb-6 text-xl text-green-500">
         We have detected signs of potential lung cancer in the uploaded image. Early detection is crucial for effective treatment and improved outcomes. We recommend consulting with a healthcare professional as soon as possible for further evaluation and personalized care.
      Please consult with your healthcare provider or a specialist in lung health to discuss your results and explore treatment options. Remember, early detection can make a significant difference in your treatment journey. Take proactive steps to prioritize your health and well-being.

      </p>
      <div className="flex gap-4 items-center">
        <FaMapMarkerAlt className="text-2xl" />
        <input
          type="text"
          placeholder="Enter your location"
          className="border border-gray-300 p-2 rounded w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <button
        onClick={handleFindDoctors}
        className="mt-20 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Find Doctors near you
      </button>
    </div>
  )
}

export default PositiveResult
