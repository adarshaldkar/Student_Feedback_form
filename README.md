🎓 Student Feedback Form

An advanced Student Feedback Management System built with React.js, Tailwind CSS, Node.js, Express.js, and MongoDB.
The platform allows admins to create and manage feedback forms, while students can securely submit responses through sharable links.

🚀 Live Demo

🔗 Click here to view the live project

(replace # with your deployed link)

✨ Features
🔐 Authentication & Security

Login & Signup with full security.

Secure session handling for both admins and users.

👨‍💻 Admin Functionalities

Create Forms – Admins can build custom feedback forms.

Manage Forms – Edit, delete, and track existing forms.

Chat Feature – Built-in chat system for communication.

File Sharing – Upload and share Excel sheets in an advanced way.

Analytics – Track total responses, number of forms created, and response count for each form.

Sharable Links – Each created form generates a unique link for student access.

👩‍🎓 User Functionalities

Access feedback forms via sharable links.

Submit feedback securely without needing admin-level access.

Simple, intuitive UI for quick submission.

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Hosting: Vercel (Frontend), Render (Backend)

📥 Installation & Setup

Follow these steps to run the project locally:

Clone the Repository

git clone https://github.com/adarshaldkar/Student_Feedback_form.git
cd Student_Feedback_form


Install Dependencies

# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install


Set Up Environment Variables
Create a .env file in your backend directory with the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run the Project

# Start backend
cd backend
npm start

# Start frontend
cd ../frontend
npm run dev


Access the App

Frontend → http://localhost:5173 (or as given by Vite)

Backend → http://localhost:5000

📖 How It Works

Admins sign up/login securely to access the dashboard.

They can create new forms, which generate unique sharable links.

Students use these links to submit feedback without needing accounts.

Admins can manage forms, view total responses, track analytics, and even chat or share Excel files with team members.

The system ensures role-based access control so that only admins handle form management while users only submit responses.

🙌 Credits

Developed By:

Adarsh Patel

Praveen Kumar

⭐ If you found this project helpful, don’t forget to star the repo and share it!
