# 🏡 Airbnb Clone – Full Stack Project

A full-stack Airbnb clone that allows users to browse listings, view property details, and interact with the platform in a seamless way. This project demonstrates real-world web development using modern technologies.

---

## 🚀 Features

* 🔍 Browse all property listings
* 🏠 View detailed listing pages
* ❤️ Add/remove listings from wishlist
* 🔐 User authentication (Login/Signup)
* ⭐ Review system (planned / in progress)
* 📱 Responsive UI for all devices

---

## 🛠️ Tech Stack

### Frontend:

* React.js
* Tailwind CSS / CSS
* Axios

### Backend:

* Node.js
* Express.js

### Database:

* MongoDB (Mongoose)

### Other Tools:

* JWT Authentication
* REST APIs
* Git & GitHub

---

## 📁 Project Structure

```
airbnb-clone/
│
├── client/                # Frontend (React)
│   ├── components/
│   ├── pages/
│   └── App.js
│
├── server/                # Backend (Node + Express)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── app.js
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/airbnb-clone.git
cd airbnb-clone
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
npm start
```

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the server folder and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📌 API Endpoints (Sample)

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | /api/listings           | Get all listings   |
| GET    | /api/listings/:id       | Get single listing |
| POST   | /api/auth/register      | Register user      |
| POST   | /api/auth/login         | Login user         |
| GET    | /api/wishlist/check/:id | Check wishlist     |

---

## 🧠 Future Improvements

* 💬 Real-time chat using WebSockets / Redis
* ⭐ Complete review & rating system
* 📍 Map integration (Google Maps)
* 💳 Payment integration
* 🔔 Notifications system

---

## 🐞 Known Issues

* Wishlist API returning 404 error (fix in progress)
* Review feature not yet implemented

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📸 Screenshots

*Add your project screenshots here*

---

## 👨‍💻 Author

**Shubham Pratap Singh**
VIT Bhopal University

---

## 📜 License

This project is for educational purposes only.

---
