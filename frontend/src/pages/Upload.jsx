import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaCloudUploadAlt } from 'react-icons/fa'
import lungImage from '../assets/lung.jpg'

function Upload() {
  const [file, setFile] = useState(null)
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [phone, setPhone] = useState('')
  
  // Derived validity flags
  const isPhoneValid = /^\d{10}$/.test(phone)
  const isFormComplete = file && age && gender && isPhoneValid

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!isFormComplete) {
      if (!isPhoneValid) {
        toast.error('Phone number must be exactly 10 digits.')
      } else {
        toast.error('Please complete all fields and select a file.')
      }
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('age', age)
    formData.append('gender', gender)
    formData.append('phone', phone)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      )

      const result = res.data.result
      toast.success(`Prediction: ${result.toUpperCase()}`)
      window.location.href = result === 'positive' ? '/positive' : '/negative'
    } catch (err) {
      toast.error('Upload failed. Please try again.')
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Upload Your CT Scan Image and wait for the results...
      </h2>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* 🫁 Lung Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={lungImage}
            alt="Lung CT"
            className="rounded-xl shadow-lg w-full max-w-[500px] object-cover"
          />
        </div>

        {/* 📤 Upload Form */}
        <form
          onSubmit={handleUpload}
          className="w-full lg:w-1/2 space-y-4 bg-gray-50 p-8 rounded-xl shadow-xl"
        >
          <h3 className="text-xl font-semibold text-gray-700">
            Submit Your Details
          </h3>

          <input
            type="number"
            placeholder="Enter age of the patient"
            className="w-full border border-gray-300 p-3 rounded"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />

          <select
            className="w-full border border-gray-300 p-3 rounded"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select the gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <div>
            <input
              type="tel"
              placeholder="Enter any contact number"
              className="w-full border border-gray-300 p-3 rounded"
              value={phone}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, '')
                setPhone(onlyNums)
              }}
              required
            />
            {!isPhoneValid && phone && (
              <p className="text-sm text-red-600 mt-1">
                Phone number must be exactly 10 digits.
              </p>
            )}
          </div>

          <label className="block w-full p-8 border-dashed border-2 border-gray-400 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition">
            <FaCloudUploadAlt className="text-5xl mx-auto text-gray-600 mb-2" />
            <p className="text-gray-700">
              {file ? file.name : 'Click to select CT scan image'}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </label>

          <button
            type="submit"
            className={`bg-black text-white w-full py-3 rounded-md transition ${
              !isFormComplete
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-800'
            }`}
            disabled={!isFormComplete}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Upload
