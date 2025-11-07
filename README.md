# NeuroFleetX - AI Powered Fleet Management System

## Overview
NeuroFleetX is an intelligent fleet management system that provides real-time vehicle telemetry, route optimization, and predictive maintenance capabilities.

## System Architecture
The system consists of two main components:
1. **Frontend**: React application with Vite build tool
2. **Backend**: Spring Boot REST API with MySQL database

## Prerequisites
- Node.js (v16 or higher)
- Java 17
- Maven
- MySQL Server
- Git

## Setup Instructions

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend/neurofleetx-vite
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the application at: http://localhost:5507

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Update the database configuration in `src/main/resources/application.properties`:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/neurofleetx
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. Build and run the application:
   ```
   mvn clean install
   mvn spring-boot:run
   ```

4. The backend API will be available at: http://localhost:8080

## API Endpoints
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/{id}` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle
- `GET /api/vehicles/status/{status}` - Get vehicles by status

## Modules

### 1. Fleet Inventory & Vehicle Telemetry
- CRUD operations for vehicle management
- Real-time telemetry monitoring
- Vehicle status tracking

### 2. AI Route & Load Optimization Engine
- Dynamic route suggestion using AI
- Load balancing for logistics
- Traffic and energy optimization

### 3. Predictive Maintenance & Health Analytics
- Vehicle health monitoring
- Maintenance prediction
- Alert system for fleet managers

## Development Notes
- The frontend and backend run on separate ports
- CORS is configured to allow communication between frontend (port 5507) and backend (port 8080)
- Dummy data is used in the frontend until the backend is fully connected

## Future Enhancements
- Integrate with Google Maps API or OpenStreetMap
- Implement real AI algorithms for route optimization
- Add user authentication and role-based access control
- Implement real-time WebSocket communication for telemetry# NeurofleetX
# NeurofleetX
# NeurofleetX
# NeurofleetX
