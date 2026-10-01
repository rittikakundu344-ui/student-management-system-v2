# 📚 Student Knowledge Management System

A full-stack MERN web application designed to help students organize, manage, and track their academic learning activities in one place.

## ✨ Features

- 📝 **Notes Management** — Create, edit, delete, search, pin, and favorite notes
- ✅ **Task Management** — Manage assignments and tasks with due dates and completion status
- 📚 **Subject Management** — Organize academic content by subject
- 🔗 **Study Resources** — Store and manage useful study links and resources
- 📊 **Dashboard** — View important academic statistics
- 👤 **User Profile** — Manage user account information
- 🌙 **Dark Mode** — Eye-friendly dark theme with persistent settings
- 🔍 **Smart Filtering** — Filter notes and tasks by relevant criteria
- 📱 **Responsive Design** — Designed for desktop, tablet, and mobile screens
- 🔐 **Authentication** — Secure user registration and login

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Context API
- Axios
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs

### Database
- MongoDB
- Mongoose

## 📁 Project Structure

```text
student-management-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- MongoDB
- Git
- A modern web browser

### 1. Clone the repository

```bash
git clone https://github.com/rittikakundu344-ui/student-management-system-v2.git
cd student-management-system-v2
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the local URL shown by Vite in your browser.

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

**Do not upload your `.env` file or any passwords/API keys to GitHub.**

## 🔒 Security

The application includes:

- Password hashing using bcryptjs
- JWT-based authentication
- Protected routes
- User-specific data handling
- Backend validation
- CORS configuration

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Full-stack MERN development
- React component-based development
- RESTful API development
- MongoDB database integration
- Authentication and authorization
- CRUD operations
- State management
- Responsive UI development
- Backend/frontend integration
- Git and GitHub workflow

## 👩‍💻 Author

**Rittika Kundu**

GitHub: [@rittikakundu344-ui](https://github.com/rittikakundu344-ui)

## 📌 Project Repository

[Student Management System](https://github.com/rittikakundu344-ui/student-management-system-v2)
