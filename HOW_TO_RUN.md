# HOW TO RUN — TaskFlow MERD Dashboard

A complete step-by-step guide to get the project running from scratch.

---

## Prerequisites

You need these installed before anything else:

| Tool | Required Version | Check |
|------|-----------------|-------|
| Node.js | v18 or higher | `node -v` |
| npm | v9 or higher | `npm -v` |
| MongoDB | v6 or higher | `mongod --version` |

---

## Step 1 — Install Node.js (if not installed)

Download from https://nodejs.org and install the **LTS** version.

Verify:
```bash
node -v   # should print v18.x.x or higher
npm -v    # should print 9.x.x or higher
```

---

## Step 2 — Install & Start MongoDB

MongoDB must be running locally for the backend to connect.

### macOS (using Homebrew — recommended)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Tap the MongoDB formula
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community@7.0

# Start MongoDB as a background service
brew services start mongodb-community@7.0

# Verify it's running
brew services list   # mongodb-community should show "started"
```

### macOS (manual start, no Homebrew)

```bash
# Start MongoDB manually (runs in foreground)
mongod --dbpath /usr/local/var/mongodb
```

### Windows

1. Download the MongoDB Community installer from https://www.mongodb.com/try/download/community
2. Run the `.msi` installer — choose "Complete" setup
3. Check "Install MongoDB as a Service" during installation
4. MongoDB will start automatically on boot

Verify on Windows:
```bash
mongod --version
```

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add the repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt-get update && sudo apt-get install -y mongodb-org

# Start the service
sudo systemctl start mongod
sudo systemctl enable mongod   # auto-start on boot

# Verify
sudo systemctl status mongod
```

---

## Step 3 — Clone / Navigate to the Project

If you already have the folder:
```bash
cd "/Users/mokshad/Desktop/c/MERD dashboard"
```

---

## Step 4 — Install Dependencies

Run these three installs (root + server + client):

```bash
# Root (installs concurrently for running both servers together)
npm install

# Backend dependencies
npm install --prefix server

# Frontend dependencies
npm install --prefix client
```

Or install all at once:
```bash
npm run install:all
```

---

## Step 5 — Configure Environment Variables

The backend uses a `.env` file inside the `server/` folder. It is already created with default values:

```
server/.env
```

```env
NODE_ENV=development
PORT=5000
# Local MongoDB URI
# MONGO_URI=mongodb://localhost:27017/merd_dashboard

# Online MongoDB (Atlas) Connection URI - Replace <username>, <password>, and <cluster-url> with your credentials
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/merd_dashboard?retryWrites=true&w=majority

JWT_SECRET=merd_dashboard_super_secret_jwt_key_2024
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### How to Get Online MongoDB (MongoDB Atlas) Credentials:

If you want to connect to a cloud MongoDB Atlas database:

1. **Create an Account / Log In**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com) and log in or sign up.

2. **Create a Database / Cluster**:
   - Click **Create** to deploy a database. Choose the **M0 (Free)** option for development.
   - Select your provider (AWS, Google Cloud, Azure) and region close to you.
   - Click **Create Deployment** (or Create Cluster) and complete the verification steps.

3. **Configure Database Access (Database User)**:
   - In the left sidebar under **Security**, click on **Database Access**.
   - Click the **Add New Database User** button.
   - Under **Authentication Method**, select **Password**.
   - Enter a **Username** and **Password** (make sure to copy the password down securely as you will need it).
   - Under **Database User Privileges**, choose **Read and write to any database** (or **Atlas Admin**).
   - Click **Add User**.

4. **Configure Network Access (IP Access List)**:
   - In the left sidebar under **Security**, click on **Network Access**.
   - Click the **Add IP Address** button.
   - For development/testing from anywhere, click **Allow Access From Anywhere** (which adds IP `0.0.0.0/0`).
   - Click **Confirm** and wait a moment for the status to become active.

5. **Get the Connection URI (MONGO_URI)**:
   - In the left sidebar under **Deployment**, click on **Database**.
   - Find your Cluster (usually named `Cluster0`) and click the **Connect** button.
   - Under **Connect to your application**, select **Drivers** (or "Connect your application").
   - Select your driver as **Node.js**.
   - Scroll down to step 3, and copy the **Connection String**. It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```

6. **Update the `.env` File**:
   - Open `/server/.env` and update the `MONGO_URI` field with the copied connection string.
   - Replace `<username>` with the database username you created in step 3.
   - Replace `<password>` with the password you created in step 3 (remove the `<` and `>` angle brackets).
   - Insert the database name `merd_dashboard` in the path, right before the query parameters (e.g., replace `...mongodb.net/?...` with `...mongodb.net/merd_dashboard?...`).

---

## Step 6 — Run the Project

### Option A — Run both servers together (recommended)

From the project root:
```bash
npm run dev
```

This starts:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:5173 (or 5174 if 5173 is busy)

### Option B — Run servers separately (two terminals)

Terminal 1 — Backend:
```bash
cd "/Users/mokshad/Desktop/c/MERD dashboard/server"
npm run dev
```

Terminal 2 — Frontend:
```bash
cd "/Users/mokshad/Desktop/c/MERD dashboard/client"
npm run dev
```

---

## Step 7 — Open the App

Once both servers are running, open your browser:

```
http://localhost:5173
```

You will land on the **Login** page.

### Create your first account

1. Click **Sign up** or go to http://localhost:5173/register
2. Enter your name, email, and password (min 6 characters)
3. You will be redirected to the Dashboard automatically

---

## Project Port Summary

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

The frontend proxies all `/api/*` requests to the backend automatically — no CORS issues.

---

## Folder Structure

```
MERD dashboard/
├── client/               ← React + TypeScript frontend
│   ├── src/
│   │   ├── components/   ← UI, layout, dashboard, task components
│   │   ├── pages/        ← Dashboard, Tasks, Projects, Calendar, etc.
│   │   ├── services/     ← Axios API calls
│   │   ├── store/        ← Zustand state (auth, UI)
│   │   ├── types/        ← TypeScript interfaces
│   │   └── utils/        ← Helpers, cn(), date formatting
│   └── package.json
│
├── server/               ← Node.js + Express backend
│   ├── controllers/      ← Auth, Task, Project logic
│   ├── models/           ← Mongoose schemas
│   ├── routes/           ← Express route definitions
│   ├── middleware/        ← JWT auth, error handler
│   ├── config/           ← MongoDB connection
│   ├── .env              ← Environment variables (already configured)
│   └── package.json
│
├── package.json          ← Root scripts (dev, install:all)
└── HOW_TO_RUN.md         ← This file
```

---

## Common Issues & Fixes

### MongoDB connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:** MongoDB is not running. Start it:
```bash
# macOS
brew services start mongodb-community@7.0

# Linux
sudo systemctl start mongod

# Windows — open Services and start "MongoDB"
```

---

### Port 5000 already in use
```
Error: listen EADDRINUSE :::5000
```
**Fix:** Kill whatever is on port 5000:
```bash
# macOS / Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### Port 5173 already in use
Vite will automatically try 5174, 5175, etc. Check the terminal output for the actual URL.

---

### npm install fails
```bash
# Clear npm cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### "Cannot find module" error on frontend
```bash
cd client
rm -rf node_modules
npm install
```

---

### JWT errors / logged out unexpectedly
Clear localStorage in your browser:
- Open DevTools → Application → Local Storage → Clear all
- Then register/login again

---

### Vite proxy not forwarding to backend
Make sure the backend is running on port **5000**. The `vite.config.ts` proxies `/api` to `http://localhost:5000`.

---

## Stopping the Servers

Press `Ctrl + C` in the terminal running `npm run dev`.

To stop MongoDB:
```bash
# macOS
brew services stop mongodb-community@7.0

# Linux
sudo systemctl stop mongod
```

---

## Build for Production

```bash
# Build the frontend
npm run build --prefix client

# The output goes to client/dist/
# Serve it with any static host (Vercel, Netlify, etc.)
# Point your backend to the hosted frontend URL in server/.env → CLIENT_URL
```
