📌 CollabBoard – In-Depth Breakdown
A team collaboration platform where users can create projects, add tasks, assign team members, track progress, and communicate.

🌟 1. What Happens in the App?
🔹 Step 1: User Registration & Login
Users sign up with a username, email, and password (stored in MySQL).
PHP backend handles authentication (session-based or JWT).
Once logged in, users land on the Dashboard.
🔹 Step 2: Viewing Projects
Users see a list of public projects (posted by others).
They can search for projects using a keyword filter.
Projects show details like:
Title
Description
Project Owner
Task Progress
Members Involved
🔹 Step 3: Creating a Project
Users can create their own projects, setting:
Project name & description
Visibility (public/private)
Team members (invite by email or username)
Only project owners & managers can edit project details.
🔹 Step 4: Adding & Managing Tasks
Inside a project, users can add tasks like:
"Design homepage UI"
"Set up backend API"
"Deploy to production"
Tasks have:
Status: To Do, In Progress, Done
Priority: Low, Medium, High
Assigned User (only members of the project)
Tasks can be moved between statuses (drag & drop).
🔹 Step 5: Team Collaboration
Team members can:
Add comments to tasks for discussion.
Receive notifications when a task is assigned.
Update task progress.
Managers can reassign tasks.
🔹 Step 6: Project Overview & Analytics
Each project has a dashboard that shows:
Number of tasks completed
Project progress in percentage
Team members involved
Latest updates/comments
🔹 Step 7: User Roles & Permissions
Admin → Can create, edit, and delete projects.
Manager → Can edit projects & manage tasks.
Member → Can only view & complete assigned tasks.
🛠 2. Tech Breakdown (How It Works)
🖥️ Frontend (React)
Login & Signup Page → Sends credentials to PHP API.
Dashboard → Shows a list of all projects (fetched from API).
Project Page → Displays tasks, allows adding & updating tasks.
Task Board → Tasks are draggable (using react-beautiful-dnd).
📡 Backend (PHP + MySQL)
User Authentication (auth.php)

POST /api/register.php → Saves new users to MySQL
POST /api/login.php → Checks credentials, starts session
GET /api/user.php → Returns logged-in user’s data
Projects (projects.php)

GET /api/projects.php → Fetches all public projects
POST /api/projects.php → Creates a new project
PUT /api/projects.php?id=1 → Edits project details
DELETE /api/projects.php?id=1 → Deletes a project
Tasks (tasks.php)

GET /api/tasks.php?project_id=1 → Fetch tasks for a project
POST /api/tasks.php → Adds a new task
PUT /api/tasks.php?id=5 → Updates task status or assignment
DELETE /api/tasks.php?id=5 → Deletes a task
📂 3. Folder Structure
pgsql
Copy
Edit
collabboard-frontend (React)
├── src/
│ ├── components/ (UI Components)
│ ├── pages/ (Dashboard, Project, Login, Register)
│ ├── api/ (API Calls)
├── package.json

collabboard-backend (PHP API)
├── api/
│ ├── db.php (Database connection)
│ ├── auth.php (User login/register)
│ ├── projects.php (CRUD for projects)
│ ├── tasks.php (CRUD for tasks)
├── config.php (Database config)
├── index.php (API Index)
🔹 4. Deployment
Frontend: Vercel (or local via npm start).
Backend: XAMPP (localhost).
Database: MySQL (via phpMyAdmin).
🔥 5. Why This Project?
✅ More than CRUD – Has team interaction & real-time updates.
✅ Uses React + PHP – Perfect mix of frontend & backend skills.
✅ Can be deployed & used by real teams.
✅ Great for ALX portfolio – Demonstrates fullstack knowledge.

🛠 6. Extra Features (If You Want More Complexity)
✅ Email Notifications (SendGrid API) when assigned a task.
✅ File Attachments on tasks (upload PDFs, images).
✅ Real-time Chat for team discussions inside a project (WebSockets).

link for 1 - https://docs.google.com/document/d/1M5x07bOeM1U910LQD3RbYxZZ4OJo93YHRMK-8MvBah8/edit?tab=t.0
