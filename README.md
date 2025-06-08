Lung Cancer Detection Platform – Relife
A full-stack web application that allows users to upload CT scan images and get lung cancer predictions via a trained machine learning model. If positive, it recommends doctors based on city and offers a feedback system.
📁 Project Structure

lung-cancer-detection/
├── backend/                  # Flask API
│   ├── app.py
│   ├── model/                # TensorFlow .keras model
│   ├── uploads/              # CT scans
│   ├── static/               # Static files like images
│   ├── .env                  # Environment variables
│   └── requirements.txt
│
├── frontend/                 # React App (Vite + Tailwind + CoreUI)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx, main.jsx
│   ├── public/
│   ├── .env
│   └── package.json
│
└── README.md

⚙️ 1. Backend Setup
Step-by-step instructions to set up Flask + MongoDB + TensorFlow:
1. Navigate to backend directory:
cd backend
2. Create virtual environment:
python -m venv venv
3. Activate it:
venv\Scripts\activate (Windows)
source venv/bin/activate (Mac/Linux)
4. Install dependencies:
pip install -r requirements.txt
5. Create .env with:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
6. Add your model to model/2_epoch_model_new.keras
7. Start backend:
python app.py


💻 2. Frontend Setup
React + Vite + Tailwind + CoreUI + Toastify setup:
1. Navigate to frontend directory:
cd frontend
2. Install packages:
npm install
3. Create .env file with:
VITE_API_URL=http://127.0.0.1:5000
4. Start React frontend:
npm run dev
🔐 Environment Variables
Backend .env:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
Frontend .env:
VITE_API_URL=http://127.0.0.1:5000


✅ Features
- Secure user auth (JWT + bcrypt)
- CT scan upload and ML-based prediction
- Doctor suggestions by city
- Feedback via Google Form
