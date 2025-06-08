import { FaLungsVirus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { CCard, CCardBody } from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import doctorImage from '../assets/doctor.jpg'

function About() {
  const handleExploreClick = () => {
    toast.info('Redirecting to CT Scan Upload...')
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-800">
        <FaLungsVirus className="text-red-500 text-4xl" />
        Empowering Early Detection, Enhancing Lives
      </h2>

      {/* ✍️ Full-width Intro Paragraph */}
      <div className="text-lg pt-6 text-gray-800 mb-8 space-y-4 leading-relaxed">
        <p>
          Welcome to <strong>RELIFE</strong>, a cutting-edge lung cancer detection platform dedicated to early diagnosis and improved patient outcomes.
          Our mission is to harness the power of advanced technology and medical expertise to identify lung cancer at its earliest stages, when treatment is most effective.
        </p>
        <p>
          At RELIFE, we're committed to revolutionizing lung cancer detection with innovative solutions and compassionate care.
          Our platform utilizes state-of-the-art technology to analyze medical images and identify potential threats,
          suggesting healthcare professionals so that you can connect to them and make timely and accurate diagnoses.
          Together, let's take a proactive approach to lung health and improve the lives of those affected by lung cancer.
        </p>
      </div>

      {/* 🖼️ Image + CTA Button Side by Side */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* 📸 Image: larger width */}
        <div className="w-full lg:w-2/3">
          <img
            src={doctorImage}
            alt="AI Doctor"
            className="w-full h-[350px] object-cover object-center rounded-2xl shadow-lg"
          />
        </div>

        {/* 🚀 CTA Button: spaced from image */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start lg:ml-8">
          <a
            href="/upload"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition mx-auto mt-6 lg:mt-0"
            onClick={handleExploreClick}
          >
            Explore Our Facilities
          </a>
        </div>
      </div>
    </div>
  )
}

export default About
