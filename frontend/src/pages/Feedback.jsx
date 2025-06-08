import { FaComments } from 'react-icons/fa'

function Feedback() {
  return (
    <div className="p-8 pt-40 mx-110 max-w-2xl text-center">
      <FaComments className="text-5xl text-blue-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold mb-4">We Value Your Feedback</h2>
      <p className="mb-6">
        Help us improve our service by sharing your thoughts. Click the button below to open the feedback form.
      </p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeSAAzHzyeQr9gnD-oXHyGPVlIlWOGxkp2n9uotEwd3kqK7jw/viewform?usp=sf_link"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 inline-block"
      >
        Fill the Google Form
      </a>
    </div>
  )
}

export default Feedback
