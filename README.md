# CodeBlox: AI-Powered Coding Playground

## Project Overview

CodeBlox is an AI-powered coding playground designed to help users write, run, and learn programming interactively. The project consists of a backend API server and a frontend web application.

- The **Backend** is built with FastAPI and provides endpoints for:
  - Executing user-submitted Python code.
  - Explaining programming errors using Google Generative AI.
  - Answering coding-related questions with AI assistance.
  - Generating beginner-level coding challenges.

- The **Frontend** is a React application that offers:
  - A code editor supporting multiple programming languages.
  - An AI helper panel for coding assistance.
  - A coding challenge section to practice programming skills.

## Project Structure

- `Backend/`: Contains the FastAPI backend server code and dependencies.
- `Frontend/`: Contains the React frontend application code and assets.

## Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   python main.py
   ```

## Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```

## How to Use

- Start the backend server first.
- Then start the frontend development server.
- Open your browser and navigate to the frontend URL.
- Use the code editor to write code, get AI help, and try coding challenges.

