
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt, os
from functools import wraps
from dotenv import load_dotenv
import tensorflow as tf
from PIL import Image
import numpy as np

# ------------------- Setup -------------------
load_dotenv()
app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

app.config['MONGO_URI'] = os.getenv("MONGO_URI")
app.config['SECRET_KEY'] = os.getenv("JWT_SECRET")
mongo = PyMongo(app)

model = tf.keras.models.load_model('model/2_epoch_model_new.keras')
UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ----------------- JWT Decorator -----------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = mongo.db.users.find_one({'email': data['email']})
            if not current_user:
                return jsonify({'message': 'User not found'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# ----------------- Auth Routes -----------------
@app.route('/')
def home():
    return 'Backend is running ✅'

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    hashed_pw = generate_password_hash(data['password'])
    user = {'name': data['name'], 'email': data['email'], 'password': hashed_pw}
    mongo.db.users.insert_one(user)
    return jsonify({'message': 'User created'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = mongo.db.users.find_one({'email': data['email']})
    if user and check_password_hash(user['password'], data['password']):
        token = jwt.encode(
            {'email': user['email'], 'exp': datetime.utcnow() + timedelta(days=1)},
            app.config['SECRET_KEY']
        )
        res = jsonify({'message': 'Login successful'})
        res.set_cookie('token', token, httponly=True, samesite='Lax', secure=False)
        return res
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout')
def logout():
    res = jsonify({'message': 'Logged out'})
    res.delete_cookie('token')
    return res

@app.route('/user')
@token_required
def get_user(current_user):
    return jsonify({'email': current_user['email'], 'name': current_user.get('name', '')})

# ----------------- Prediction Upload -----------------
@app.route('/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    age = request.form.get('age')
    gender = request.form.get('gender')
    phone = request.form.get('phone')

    if not age or not gender or not phone:
        return jsonify({'error': 'Missing patient details'}), 400

    filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filename)

    img = Image.open(filename).resize((224, 224))
    img_array = np.expand_dims(np.array(img) / 255.0, axis=0)
    prediction = model.predict(img_array)[0][0]
    result = 'positive' if prediction < 0.5 else 'negative'

    mongo.db.predictions.insert_one({
        'email': current_user['email'],
        'age': age,
        'gender': gender,
        'phone': phone,
        'filename': file.filename,
        'result': result,
        'timestamp': datetime.utcnow()
    })

    return jsonify({
        'result': result,
        'age': age,
        'gender': gender,
        'phone': phone
    })

# ----------------- Doctor Selection -----------------
INDIAN_DOCTORS = {
    "delhi": [
        {"name": "Dr. Rakesh Sharma", "venue": "AIIMS Delhi", "rating": 4.8, "timing": "9AM–5PM"},
        {"name": "Dr. Neha Gupta", "venue": "Fortis Hospital", "rating": 4.6, "timing": "10AM–4PM"},
        {"name": "Dr. Amit Bansal", "venue": "Max Healthcare", "rating": 4.7, "timing": "11AM–6PM"},
    ],
    "mumbai": [
        {"name": "Dr. Sneha Rao", "venue": "Lilavati Hospital", "rating": 4.9, "timing": "10AM–5PM"},
        {"name": "Dr. Rajeev Patil", "venue": "Kokilaben Hospital", "rating": 4.5, "timing": "8AM–3PM"},
        {"name": "Dr. Alisha Mehta", "venue": "Tata Memorial", "rating": 4.6, "timing": "9AM–4PM"},
    ],
    "bangalore": [
        {"name": "Dr. Meera Iyer", "venue": "Manipal Hospital", "rating": 4.7, "timing": "9AM–4PM"},
        {"name": "Dr. Karthik Reddy", "venue": "Apollo Hospital", "rating": 4.6, "timing": "10AM–6PM"},
        {"name": "Dr. Sneha Kulkarni", "venue": "Narayana Health", "rating": 4.8, "timing": "8AM–2PM"},
    ],
    "kolkata": [
        {"name": "Dr. Arindam Basu", "venue": "AMRI Hospital", "rating": 4.8, "timing": "10AM–5PM"},
        {"name": "Dr. Priya Sen", "venue": "Fortis Anandapur", "rating": 4.7, "timing": "9AM–3PM"},
        {"name": "Dr. Saurav Roy", "venue": "Belle Vue Clinic", "rating": 4.6, "timing": "11AM–6PM"},
    ],
    "hyderabad": [
        {"name": "Dr. Anjali Rao", "venue": "Yashoda Hospitals", "rating": 4.8, "timing": "9AM–5PM"},
        {"name": "Dr. Ravi Teja", "venue": "KIMS Hospital", "rating": 4.7, "timing": "10AM–6PM"},
        {"name": "Dr. Pooja Iyer", "venue": "Apollo Jubilee Hills", "rating": 4.6, "timing": "8AM–2PM"},
    ],
    "chennai": [
        {"name": "Dr. Shyam Sundar", "venue": "MIOT Hospitals", "rating": 4.9, "timing": "10AM–6PM"},
        {"name": "Dr. Revathi Rajan", "venue": "Apollo Greams Road", "rating": 4.7, "timing": "9AM–3PM"},
        {"name": "Dr. Anand Krishnan", "venue": "Fortis Malar", "rating": 4.6, "timing": "8AM–1PM"},
    ],
    "pune": [
        {"name": "Dr. Swati Deshmukh", "venue": "Ruby Hall Clinic", "rating": 4.8, "timing": "10AM–4PM"},
        {"name": "Dr. Nikhil Joshi", "venue": "Sahyadri Hospitals", "rating": 4.6, "timing": "9AM–5PM"},
        {"name": "Dr. Leena Patil", "venue": "Jehangir Hospital", "rating": 4.7, "timing": "11AM–6PM"},
    ],
    "ahmedabad": [
        {"name": "Dr. Mehul Shah", "venue": "Sterling Hospital", "rating": 4.7, "timing": "9AM–5PM"},
        {"name": "Dr. Rekha Patel", "venue": "CIMS Hospital", "rating": 4.8, "timing": "10AM–4PM"},
        {"name": "Dr. Jignesh Thakkar", "venue": "SAL Hospital", "rating": 4.6, "timing": "8AM–3PM"},
    ],
  "jaipur": [
    {"name": "Dr. Anuradha Malhotra", "venue": "Apex Hospital Jaipur", "rating": 4.7, "timing": "9AM–3PM"},
    {"name": "Dr. Vikram Singh", "venue": "Tagore Hospital & Research Institute", "rating": 4.6, "timing": "10AM–4PM"},
    {"name": "Dr. Meenal Sharma", "venue": "Deep Hospital & Research Centre", "rating": 4.5, "timing": "11AM–5PM"}
  ],
  "lucknow": [
    {"name": "Dr. Suresh Mishra", "venue": "Mayo Medical Centre", "rating": 4.6, "timing": "10AM–4PM"},
    {"name": "Dr. Anita Verma", "venue": "Shalimar Hospital", "rating": 4.5, "timing": "9AM–3PM"},
    {"name": "Dr. Rajeev Gupta", "venue": "Ahuja Hospital", "rating": 4.7, "timing": "11AM–6PM"}
  ],
  "kochi": [
    {"name": "Dr. Priya Nair", "venue": "Lisie Hospital", "rating": 4.8, "timing": "9AM–5PM"},
    {"name": "Dr. Thomas Philip", "venue": "VPS Lakeshore Hospital", "rating": 4.7, "timing": "10AM–6PM"},
    {"name": "Dr. Rohan Menon", "venue": "Amrita Hospital", "rating": 4.9, "timing": "8AM–2PM"}
  ],
  "indore": [
    {"name": "Dr. Neha Kapoor", "venue": "Maharaja Yashwantrao Hospital", "rating": 4.6, "timing": "9AM–5PM"},
    {"name": "Dr. Gaurav Khandelwal", "venue": "Choithram Hospital & Research Centre", "rating": 4.7, "timing": "10AM–4PM"},
    {"name": "Dr. Sameer Jain", "venue": "Bombay Hospital Indore", "rating": 4.5, "timing": "11AM–6PM"}
  ],
  "visakhapatnam": [
    {"name": "Dr. Kavita Rao", "venue": "King George Hospital", "rating": 4.7, "timing": "9AM–4PM"},
    {"name": "Dr. Ramesh Babu", "venue": "Apollo Hospitals Visakhapatnam", "rating": 4.8, "timing": "10AM–5PM"},
    {"name": "Dr. Sunitha Sharma", "venue": "Care Hospitals Visakhapatnam", "rating": 4.6, "timing": "11AM–6PM"}
  ],
  "surat": [
    {"name": "Dr. Hetal Shah", "venue": "CIMS Hospital", "rating": 4.7, "timing": "9AM–3PM"},
    {"name": "Dr. Rajesh Patel", "venue": "Sterling Hospitals", "rating": 4.6, "timing": "10AM–4PM"},
    {"name": "Dr. Shilpa Desai", "venue": "Lifecare Hospital", "rating": 4.5, "timing": "11AM–6PM"}
  ],
  "vadodara": [
    {"name": "Dr. Mehul Shah", "venue": "Aashirvad Super Speciality Children Hospital", "rating": 4.7, "timing": "9AM–5PM"},
    {"name": "Dr. Rekha Patel", "venue": "CIMS Hospital", "rating": 4.8, "timing": "10AM–4PM"},
    {"name": "Dr. Jignesh Thakkar", "venue": "SAL Hospital", "rating": 4.6, "timing": "8AM–3PM"}
  ],
  "bhopal": [
    {"name": "Dr. Pooja Verma", "venue": "Gandhi Medical College & Hospital", "rating": 4.6, "timing": "9AM–5PM"},
    {"name": "Dr. Sumit Jain", "venue": "Bansal Hospital Bhopal", "rating": 4.7, "timing": "10AM–4PM"},
    {"name": "Dr. Anjali Sharma", "venue": "AIIMS Bhopal", "rating": 4.8, "timing": "11AM–6PM"}
  ],
  "guwahati": [
    {"name": "Dr. Manash Das", "venue": "AIIMS Guwahati", "rating": 4.7, "timing": "9AM–3PM"},
    {"name": "Dr. Ananya Roy", "venue": "GNRC Hospitals", "rating": 4.6, "timing": "10AM–5PM"},
    {"name": "Dr. Ritu Baruah", "venue": "Gauhati Medical College & Hospital", "rating": 4.5, "timing": "11AM–6PM"}
  ],
  "chandigarh": [
    {"name": "Dr. Vivek Malhotra", "venue": "PGIMER Chandigarh", "rating": 4.8, "timing": "9AM–4PM"},
    {"name": "Dr. Simran Kaur", "venue": "Fortis Hospital Mohali", "rating": 4.7, "timing": "10AM–5PM"},
    {"name": "Dr. Rajiv Sharma", "venue": "Max Super Specialty Hospital", "rating": 4.6, "timing": "11AM–6PM"}
  ]
}

@app.route('/select-doctor', methods=['POST'])
def select_doctor():
    location = request.json.get('location', '').strip().lower()
    doctors = INDIAN_DOCTORS.get(location, [])
    return jsonify({'doctors': doctors})

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(STATIC_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
