# Primetrade.ai - Backend Developer Intern Task

A full-stack MERN application demonstrating secure API design, JWT authentication, role-based access control (User/Admin), and CRUD operations.

## 🚀 Quick Start Setup

### Prerequisites
- Node.js installed
- MongoDB URI

### Backend Setup
1. `cd backend-intern-task`
2. `npm install`
3. Create a `.env` file based on `.env.example` (add your MONGO_URI and JWT_SECRET).
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 🔗 API Documentation
https://drive.google.com/file/d/1YLAY6zmMTxKV8tlh35jt-ntfsK3vLPcq/view?usp=sharing

## 📈 Scalability & Deployment Note
To prepare this system for a high-traffic production environment, I would implement the following architectural changes:
- **Microservices Transition:** Decouple the Authentication service from the core Task Management service to allow independent scaling based on load.
- **Caching Layer:** Introduce Redis to cache frequently accessed data (like system-wide tasks for admins) to reduce MongoDB read-heavy operations.
- **Database Optimization:** Add compound indexes on the `Task` collection (e.g., `userId` and `status`) to maintain fast query times as the dataset grows.
- **Pagination:** Implement cursor-based pagination on the Admin `GET /all` route to prevent memory overload when fetching massive amounts of user data.
- **Load Balancing:** Deploy the containerized backend behind a Load Balancer (like NGINX or AWS ALB) leveraging stateless JWT authentication to distribute traffic horizontally.