NexoraSpace
Introduction

NexoraSpace is a secure and scalable Multi-Tenant SaaS platform designed for companies, startups, and enterprise teams to efficiently manage projects, employees, documents, billing, and AI-powered workflows.
Each organization (tenant) operates in its own isolated environment, ensuring that no other company can access its data. NexoraSpace includes a complete project management system, employee access control (RBAC), subscription management, and an AI multi-agent workspace that analyzes project documents such as SRS files.

The NexoraSpace platform provides companies with the ability to:

Manage projects, tasks, documents, and teams in one unified system.

Upload SRS or technical documents and use AI to analyze, summarize, and generate insights.

Assign employees and control access using strict RBAC permissions.

Monitor subscription usage, AI requests, and project activity from an organized dashboard.

Project Preview


(Replace this GIF with your actual demo GIF)

NexoraSpace Demo: https://your-demo-link.com

NexoraSpace Intro: https://your-intro-video.com

NexoraSpace Gallery: https://your-gallery-link.com

Features

Multi-Tenant Architecture: Each company operates in a separate tenant environment with complete data isolation.

Role-Based Access Control (RBAC): Admin, Manager, and Employee roles determine what actions a user can perform.

Project & Document Management: Create projects, upload SRS files, assign employees, and track progress.

AI Multi-Agent Workspace: Upload documents and ask AI questions, generate task breakdowns, test cases, documentation, and summaries.

Billing & Subscription System: Manage plan limits for employees, projects, and AI usage.

Secure Authentication: Token-based login system ensuring only verified users access sensitive company data.

Technologies Used

NexoraSpace is built with a modern architecture to ensure scalability, security, and efficient performance:

Frontend: React + Vite for a fast and interactive user interface.

Backend: Node.js and Express.js for building secure REST APIs.

Database: MongoDB with tenant-based data structures.

Authentication: JWT (JSON Web Token) for secure login.

AI Integration: External LLM APIs for multi-agent document analysis.

How to Set Up and Use NexoraSpace

Follow the steps below to run this project on your local machine.

1. Clone the Repository
git clone https://github.com/your-username/NexoraSpace.git
cd NexoraSpace

2. Install Backend Dependencies
cd backend
npm install

3. Configure Backend Environment Variables

Create a .env file in the backend directory:

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_ai_key


Replace the values with your actual configuration.

4. Start the Backend Server
npm run dev


The backend will start on the configured port (default: http://localhost:5000
).

5. Install Frontend Dependencies
cd ../nexoraspace-frontend
npm install

6. Start the Frontend Application
npm run dev


The frontend will be available at:

http://localhost:5173

Use the Application

Once both the backend and frontend are running, you can start using NexoraSpace:

Open Your Browser: Go to http://localhost:5173

Register a New Company (Tenant): Create an isolated workspace for your organization.

Login: Use your credentials to access the system.

Dashboard: View summaries of projects, employees, AI activity, and usage statistics.

Create Projects: Add new projects, upload SRS files, and assign team members.

Use AI Workspace: Ask AI questions related to your uploaded project documents.

Manage Employees: Add employees, assign roles, and control access.

Billing & Subscription: View or modify your tenant’s subscription plan.

Logout: End your session securely.
