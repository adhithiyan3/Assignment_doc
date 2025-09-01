# 📄 Assignment Portal

An **AI-powered collaborative knowledge hub** built with **MERN (MongoDB, Express, React, Node.js) + Gemini AI**.  
This app allows teams to create, upload, manage, search, and collaborate on documents with advanced features like **summarization, semantic search, tags, version history, and activity tracking**.

---

## 🚀 Features

### ✅ Authentication & Authorization
- JWT-based login/register  
- Role-based access: **admin & user**  
- **Admin** can edit/delete any doc; **users** can only manage their own  

### ✅ Document Management
- Upload **PDFs** (parsed & stored in MongoDB)  
- Create documents manually via editor  
- Edit, update, and delete documents  

### ✅ AI-Powered Features (Gemini)
- Automatic **summarization** of documents  
- Smart **tag generation**  
- **Semantic search** over documents  
- Simple **Q&A** over document content  

### ✅ Collaboration Tools
- Document **version history** (tracks edits)  
- **Activity feed** (who did what & when)  

### ✅ Frontend (React + Vite)
- **Dark/light mode toggle**  
- Document filter by **tags**  
- Responsive UI with **TailwindCSS**  

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React + Vite  
- 🎨 TailwindCSS  
- 🌙 Dark/Light Theme Toggle  

### Backend
- 🟢 Node.js + Express  
- 🍃 MongoDB + Mongoose  
- 🔐 JWT Authentication  
- 🤖 AI (Gemini API for summarization & tags)  
- 📄 pdf-parse (extract text from PDFs)  

---

## 📂 Project Structure

ASSIGNMENT_DOC/
│── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable components (Navbar, DocumentCard, etc.)
│ │ ├── context/ # Theme context
│ │ ├── pages/ # React pages (Login, Register, Documents, etc.)
│ │ └── utils/ # API helper
│ └── vite.config.js # Vite config
│
│── server/ # Node.js backend
│ ├── config/ # Database & JWT config
│ ├── controllers/ # Business logic
│ ├── middleware/ # Auth middleware
│ ├── models/ # Mongoose models (User, Document, Activity, etc.)
│ ├── routes/ # Express routes
│ ├── services/ # AI service, helpers
│ ├── uploads/ # Uploaded PDFs
│ └── index.js # Entry point
│
├── .env # Environment variables (ignored in git)
├── .env.example # Sample env file
├── .gitignore # Ignore node_modules, env, build files
├── package.json
└── README.md

---

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
# bash
git clone https://github.com/your-username/assignment-doc.git
cd assignment-doc


# Backend
cd server
npm install

# Frontend
cd ../client
npm install


MONGO_URI=mongodb+srv://your_user:your_pass@cluster0.mongodb.net/assignment_doc
JWT_SECRET=your_jwt_secret
PORT=3000

# Backend
cd server
npm start

# Frontend
cd ../client
npm run dev
## 🧪 Testing

### 🔑 Sample Login
- Register a new user via `/register`
- Login → JWT is stored in `localStorage`
- **Admin** can edit/delete any document, **normal users** can only manage their own

---

### 📤 Uploading Docs
- Go to `/upload` → upload a PDF  
- System automatically:
  - Extracts text  
  - Summarizes content  
  - Generates tags  

---

### 🤖 AI Features
- **Click Summarize** → auto-updates document summary  
- **Click Generate Tags** → adds smart tags  
- **Use `/search`** → test semantic search  

---
## 📸 Screenshots

### Dashboard
![Dashboard](/assets/imagedoc.png)

### Activity Feed
![Activity Feed](/assets/imageact.png)


---

## 🤝 Contributing
1. **Fork** the repo  
2. **Create** a new branch:  
   ```bash
   git checkout -b feature/your-feature



---
