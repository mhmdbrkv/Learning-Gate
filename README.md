# Learning‑Gate

**An award‑winning graduation project** — a robust backend infrastructure for an online learning platform built with modern technologies and best practices in mind.

---

## Table of Contents
1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Project Structure](#project-structure)  
5. [Getting Started](#getting-started)  
6. [Usage](#usage)  
7. [Running Tests](#running-tests)  
8. [Deployment](#deployment)  
9. [Contributing](#contributing)  
10. [License](#license)  
11. [Contact](#contact)

---

## Introduction
Learning‑Gate is a scalable **RESTful API backend** designed to power e‑learning platforms. It features clean architecture, security-first practices, and delivers high performance for intense, real-world usage. Developed as a graduation project, it's recognized for its robust implementation and system design.

---

## Features
- **Modular architecture** with SOLID principles  
- CRUD operations for users, courses, and enrolments  
- Secure authentication (JWT, password hashing)  
- Role‑based access control (admin, instructor, student)  
- Input validation and error handling  
- Middleware for logging and request tracking  
- Rate limiting and API security best practices  
- Unit and integration testing  
- Containerized with Docker—easy deployment to AWS

---

## Tech Stack
- **Runtime:** Node.js (≥14)  
- **Language:** TypeScript  
- **Framework:** Express.js  
- **Database:** MongoDB, Redis (for caching/session)  
- **Testing:** Jest, Supertest  
- **DevOps:** Docker, AWS (EC2, S3)

---

## Project Structure
```
learning-gate/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── app.ts
├── tests/
├── config/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (≥14)  
- Docker & Docker Compose  
- MongoDB & Redis (or containerized via Docker)  

### Setup
1. Clone the repo  
   ```bash
   git clone https://github.com/mhmdbrkv/Learning-Gate.git
   cd Learning-Gate
   ```
2. Install dependencies  
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure:
   ```
   MONGODB_URI=
   REDIS_URL=
   JWT_SECRET=
   PORT=4000
   ```
4. Start in development mode:
   ```bash
   npm run dev
   ```

---

## Usage
- Access the application at `http://localhost:4000/`
- Explore routes via API documentation (Swagger or Postman collection)
- Common API endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - CRUD operations under `/users`, `/courses`, `/enrollments` with proper roles

---

## Running Tests
```bash
npm test
```
Includes both **unit** and **integration** tests via Jest and Supertest.

---

## Deployment
Containerized with Docker:
```bash
docker-compose up --build
```
Deployed to AWS (EC2, S3) for production environments, configured for scalability and performance.

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository  
2. Create a feature branch `feature/your-feature`  
3. Commit with clarity ✍️  
4. Submit a pull request for review

---

## License
Distributed under the [MIT License]—see the `LICENSE` file for details.

---

## Contact
Mohamed Baraka – Backend Developer  
**Email:** barakamohamed946@gmail.com  
**LinkedIn:** [linkedin.com/in/mohamed-baraka-3b832a250](https://linkedin.com/in/mohamed-baraka-3b832a250)  
**GitHub:** [github.com/mhmdbrkv](https://github.com/mhmdbrkv)  
