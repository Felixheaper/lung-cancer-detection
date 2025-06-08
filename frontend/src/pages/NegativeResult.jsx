import { Link } from 'react-router-dom'
import { FaThumbsUp } from 'react-icons/fa'

function NegativeResult() {
  return (
    <div className="p-8 pt-30 max-w-2xl mx-100 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">No Signs of Lung Cancer</h2>
      <p className="mb-6 text-xl text-red-500">
      This is good news! We are pleased to inform you that no signs of lung cancer were detected in the uploaded image. 
      <br></br>
      While this is encouraging news, it's important to continue prioritizing your lung health and taking proactive measures for prevention and early detection.  We recommend maintaining a healthy lifestyle, scheduling regular check-ups with your healthcare provider, and staying informed about lung cancer risk factors. Remember, prevention and early detection are key to reducing the risk of lung cancer. Stay proactive and prioritize your health for a brighter future.
      </p>
      <FaThumbsUp className="text-6xl mx-auto text-green-500 mb-4" />
      <Link
        to="/feedback"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Give Feedback
      </Link>
    </div>
  )
}

export default NegativeResult
