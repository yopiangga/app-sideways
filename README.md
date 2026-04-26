# Monitoring Dashboard System

A full-stack command center dashboard featuring real-time (mocked) CCTV feeds, intelligence news, maritime radar (AIS), and flight tracking.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Leaflet, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, JWT Authentication.

## Features
- **Secure Access**: Protected login system (admin/123456).
- **Command Center Design**: High-tech, dark-themed responsive UI.
- **Surveillance**: Integrated CCTV grid from JSON configuration.
- **Intelligence**: National news feed aggregator.
- **Radar**: Maritime and Aviation tracking on a global map.

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Server will run on http://localhost:5000*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*App will run on http://localhost:5173*

## Credentials
- **Username**: `admin`
- **Password**: `123456`

## Configuration
- CCTV feeds can be managed in `backend/data/cctv.json`.
- Map trackers refresh every 10 seconds.
