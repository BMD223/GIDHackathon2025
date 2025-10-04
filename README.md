# GetItHere Transit Reporting System

A web application for reporting and visualizing public transport delays and incidents in Kraków.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database & Data](#database--data)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Development & Contribution](#development--contribution)
- [Testing](#testing)
- [License](#license)

---

## Project Overview

GetItHere enables users to:
- Report transit delays and incidents.
- View a heatmap of delays across Kraków.
- Analyze public transport data using GTFS and custom CSVs.

## Architecture

- **Backend:** Django REST API (`GetItHere/backend/`)
- **Frontend:** React app (`GetItHere/frontend/`)
- **Database:** SQL scripts and CSV/GTFS data (`GetItHere/DataBase/`, `Routes_and_stops/`)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd GetItHere/backend

2. Create a virtual environment:
   ```bash
    python -m venv venv
    venv\Scripts\activate
3. Install dependencies:
   ```bash
    pip install -r requirements.txt
4. Apply migrations:
    ```bash
    python manage.py migrate
5. Start the development server:
   ```bash
    python manage.py runserver

## Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd GetItHere/frontend
2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npm start
The app will open in your browser at http://localhost:3000.

## Database & Data
- SQL Structure:See GetItHere/DataBase/dbstruct.sql
- Entity Relationship Diagram: See GetItHere/DataBase/ERD.png
- Sample Data: CSVs and GTFS files in Routes_and_stops/
- Data Utilities: Python scripts in GetItHere/DataBase/ for populating and checking the database

## API Endpoints
- Delays: /api/delays/ — Submit and retrieve delay reports
- Incidents: /api/incidents/ — Submit and retrieve incident reports
- Heatmap Data: /api/heatmap/ — Get aggregated delay data

See Django app transport/views.py and delays/views.py for details.

## Testing
- Backend tests: `GetItHere/backend/tests/`
- Frontend tests: `GetItHere/frontend/src/__tests__/`

## License

See LICENSE for details.
   
   