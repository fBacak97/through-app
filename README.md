# Through

Through is a location & profession based streaming platform where every single user has its own channel and freely able to stream. It utilizes Agora's Live Streaming SDK to provide streaming solution.

# Configuration

We will assume that you have Node.js installed on your machine!

Search for "ENTER_YOUR" in the codebase to see which variables you need to get this app up and running.

# Running dev environment

First, run the backend;

- cd through-backend
- npm install
- npm run dev

Second, run the frontend;

- cd through-frontend
- npm install
- npm start

This will open up your default browser, relocate to URL http://localhost:3000 and you will be able to use development environment of Through.

# Running production build

First, build the frontend;

- cd through-frontend
- npm run build

Second, build the backend;

- cd through-backend
- npm run build
- npm run start

This will launch the backend and the backend will serve the static files from the frontend seemlessly. 
Open a browser and relocate to http://localhost:5000 and you will be able to use the production build of Through.
