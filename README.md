# Quiz Application Setup Guide

This is a full-stack quiz application built with React, Node.js, and MongoDB. Follow these instructions to set up the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation) or a MongoDB Atlas account
- [Git](https://git-scm.com/downloads)
- [Google Cloud Account](https://cloud.google.com/) (for Gemini API access)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd quiz-application
```

### 2. Environment Setup

#### Backend Configuration
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

To get your Gemini API key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gemini API
4. Create credentials and copy your API key

#### Frontend Configuration
The frontend configuration is already set up in `vite.config.js` with the proxy to backend services.

### 3. Install Dependencies

Install server dependencies:
```bash
cd server
npm install
```

Install client dependencies:
```bash
cd ../client
npm install
```

### 4. Database Setup

If using MongoDB locally:
1. Start MongoDB service on your machine
2. The application will automatically create required collections

If using MongoDB Atlas:
1. Create a cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string and update it in the server's `.env` file

### 5. Running the Application

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features

- User authentication (Student/Faculty roles)
- PDF upload and automatic quiz generation
- Real-time quiz taking with timer
- Immediate scoring and feedback
- Quiz history and performance tracking

## Project Structure

```
quiz-application/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   └── services/     # API service layer
└── server/                # Backend Node.js application
    ├── models/           # MongoDB schemas
    ├── routes/           # API routes
    ├── middleware/       # Express middlewares
    └── services/         # Business logic services
```

## Available Scripts

### Backend

- `npm run dev`: Start server with nodemon
- `npm start`: Start server in production mode

### Frontend

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
