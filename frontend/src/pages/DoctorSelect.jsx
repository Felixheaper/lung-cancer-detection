import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell } from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import { toast } from 'react-toastify'
import { FaStethoscope } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function DoctorSelect() {
  const locationState = useLocation()
  const locationName = locationState?.state?.location
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/select-doctor`, {
          location: locationName,
        })
        setDoctors(res.data.doctors)
      } catch (err) {
        toast.error('Failed to fetch doctors')
      }
    }
    fetchDoctors()
  }, [locationName])

  return (
    <div className="p-8 pt-40 mx-110">
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <FaStethoscope className="text-blue-600" />
        Doctors in {locationName}
      </h2>
      {doctors.length > 0 ? (
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Venue</CTableHeaderCell>
              <CTableHeaderCell>Rating</CTableHeaderCell>
              <CTableHeaderCell>Timings</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {doctors.map((doc, i) => (
              <CTableRow key={i}>
                <CTableDataCell>{doc.name}</CTableDataCell>
                <CTableDataCell>{doc.venue}</CTableDataCell>
                <CTableDataCell>{doc.rating}</CTableDataCell>
                <CTableDataCell>{doc.timing}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <p>No doctors found in {locationName}</p>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/feedback"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Give your valuable Feedback
        </Link>
      </div>
    </div>
  )
}

export default DoctorSelect
