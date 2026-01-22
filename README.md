# 📰 NewsPLAT

A full-stack news platform that enables users to browse, save, and interact with news articles, while providing journalists and admins with powerful content management tools.

---

## 🚀 Features

### 👤 User
- Browse published news articles
- Save articles to favorites
- User authentication (login / register)
- Clean and responsive UI

### ✍️ Journalist
- Create and edit news articles
- Submit articles for review
- Manage personal published content

### 🛠️ Admin
- Review and approve/reject articles
- Manage users and roles
- Full control over platform content

---

## 🧱 Tech Stack

### Frontend
- React
- JavaScript (ES6)
- HTML5 / CSS3

### Backend
- Python
- Sanic
- SQLite (development)

### Other Tools
- RESTful APIs
- Git & GitHub
- JWT Authentication

---

## 📁 Project Structure

```text
NewsPLAT/
│
├── frontend/                       # React frontend application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── api/
│       └── App.jsx
│
├── backend/                        # Sanic backend application
│   ├── app/
│   │   ├── modules/                # Feature-based modules (auth, news, users)
│   │   ├── routes/                 # API route definitions
│   │   ├── utils/                  # Helper & utility functions
│   │   └── main.py                 # App factory
│   ├── run.py                      # Server entry point
│   └── requirements.txt
│
├── README.md
└── .gitignore
```
## 📸 Screenshots
### 📝 Create News (Journalist)
Interface for journalists to create news articles with title, content, image upload, and submission for review.
![Create News](https://github.com/osamabanihani/NewsPLAT/blob/main/Screenshot%202026-01-22%20132855.png)

---

### 🗂️ Journalist Dashboard
Dashboard for journalists to manage their news posts (edit, delete, track status).
![Journalist Dashboard](https://github.com/osamabanihani/NewsPLAT/blob/main/Screenshot%202026-01-22%20133219.png )

---

### 🛡️ Admin Dashboard
Admin panel to review pending news articles and manage platform content.
![Admin Dashboard](https://github.com/osamabanihani/NewsPLAT/blob/main/Screenshot%202026-01-22%20133244.png)

---

### 📰 News Article View
Detailed view of a published news article including image and full content.
![News Details](https://github.com/osamabanihani/NewsPLAT/blob/main/Screenshot%202026-01-22%20133426.png)

---

### ⭐ Favorites
Users can save and manage their favorite news articles.
![Favorites](https://github.com/osamabanihani/NewsPLAT/blob/main/Screenshot%202026-01-22%20133414.png)

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/osamabanihani/NewsPLAT.git
cd NewsPLAT
```
### 2️⃣ Backend setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### 3️⃣ Frontend setup
```bash
cd frontend
npm install
npm start
```

## 🔐 Authentication

JSON Web Tokens (JWT)

Role-based access control (User / Journalist / Admin)

## 📌 Future Improvements

PostgreSQL support

Email notifications

Search & filtering

Deployment (Docker / Cloud)

Unit & integration testing

## 👨‍💻 Author

Osama Banihani
Computer Science Student | Full-Stack Developer

GitHub: https://github.com/osamabanihani

LinkedIn: https://linkedin.com/in/osama-banihani-77896b289


