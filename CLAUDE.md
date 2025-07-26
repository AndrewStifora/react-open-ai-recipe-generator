# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (React App)
```bash
cd recipe-generator
npm start          # Start development server (port 3000)
npm run build      # Build for production
npm test           # Run tests
```

### Backend (Express Server)
```bash
cd server
node server.js     # Start backend server (port 3001)
```

Note: The backend requires an OpenAI API key in environment variables to function.

## Architecture Overview

This is a full-stack React/Node.js recipe generator application that uses OpenAI's API to generate recipes based on user preferences.

### Project Structure
- `recipe-generator/` - React frontend application
- `server/` - Express.js backend API server
- Root level contains legacy files (App.js, server.js)

### Key Components

**Frontend (`recipe-generator/src/App.js`)**
- `RecipeCard` component: Form for user inputs (ingredients, meal type, cuisine, cooking time, complexity)
- Main `App` component: Handles state management and SSE connection to backend
- Uses Tailwind CSS for styling
- Implements Server-Sent Events (SSE) for real-time streaming of recipe generation

**Backend (`server/server.js`)**
- Express server with CORS enabled
- Single endpoint: `GET /recipeStream` - streams OpenAI responses via SSE
- Uses OpenAI's `gpt-4o-mini` model with streaming enabled
- Constructs detailed prompts based on user form inputs

### Data Flow
1. User fills out recipe form in React frontend
2. Form submission triggers SSE connection to `/recipeStream`
3. Backend constructs prompt and streams OpenAI API response
4. Frontend receives and displays recipe text in real-time

### Technology Stack
- Frontend: React 19, Tailwind CSS, Create React App
- Backend: Express.js, OpenAI API, CORS
- Communication: Server-Sent Events (SSE)

### Key Files
- `recipe-generator/src/App.js` - Main React component with form and SSE logic
- `server/server.js` - Express server with OpenAI integration
- `recipe-generator/tailwind.config.js` - Tailwind CSS configuration