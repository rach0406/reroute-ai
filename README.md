# ReRoute AI: Smart Transportation and Logistics Recovery System for Post-Crisis Supply Chains

> **College Major Project**  
> **Submission Deadline Target:** September 3, 2026  
> **System Architecture:** React + Vite + Leaflet GIS | FastAPI + NetworkX | Scikit-Learn Random Forest

---

## 📌 Project Overview

**ReRoute AI** is an intelligent decision-support platform designed to restore critical supply chain and transportation networks immediately following natural disasters, floods, earthquakes, extreme weather, or infrastructure damage.

Traditional logistics systems rely on static, pre-defined routes and manual dispatching, making them brittle during crises. **ReRoute AI** dynamically resolves bottlenecks by:
1. **Predicting Road Disruptions** using Random Forest Machine Learning (trained on congestion, road integrity, weather severity, vehicle load, and capacity constraints).
2. **Dynamically Optimizing Delivery Routes** via NetworkX using custom Dijkstra and A* graph algorithms with multi-objective weight functions (distance, travel time, traffic pressure, risk penalty, fuel cost, and road blockages).
3. **Prioritizing Essential Commodities** (Emergency medicine & vaccines [CRITICAL], food & water [HIGH], shelter supplies [MEDIUM], general cargo [LOW]).
4. **Interactive GIS Visualization** with Leaflet.js displaying OpenStreetMap tiles, warehouse hubs, relief camps, hospitals, vehicle positions, risk polygons, and blocked corridors.
5. **Real-time Crisis Simulation** allowing disaster authorities to simulate flash floods or bridge collapse events with instant automated dynamic rerouting.

---

## 🏗️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Leaflet.js, React Leaflet, Recharts, Lucide Icons |
| **Backend API** | Python 3.11+, FastAPI, Pydantic V2, Uvicorn, SQLAlchemy |
| **Machine Learning** | Scikit-Learn (Random Forest Classifier), Pandas, NumPy, Joblib |
| **Route Optimization** | NetworkX (Multi-factor Dijkstra & A* Graph Algorithms) |
| **Database** | SQLite (Default Zero-Config) / PostgreSQL Supported |
| **DevOps & Container** | Docker, Docker Compose, Pytest |

---

## 📂 Project Structure

```
reroute-ai/
├── backend/
│   ├── app/
│   │   ├── database/     # SQLAlchemy engine, models, session provider
│   │   ├── routers/      # FastAPI REST API routers (auth, dashboard, roads, shipments, ML, routes, crisis)
│   │   ├── schemas/      # Pydantic request/response models
│   │   └── main.py       # FastAPI application entry point
├── ml/
│   ├── data/             # Synthetic post-crisis transportation dataset & generator
│   ├── models/           # Saved Random Forest model & feature scaler pickles
│   ├── train_model.py    # Model training & metrics evaluation script
│   └── predict.py        # ML inference engine class
├── optimization/
│   ├── graph.py          # NetworkX road graph builder
│   ├── dijkstra.py       # Multi-objective Dijkstra algorithm
│   ├── astar.py          # Spatial heuristic A* algorithm
│   └── optimizer.py      # High-level route planner & decision rationale engine
├── database/
│   └── seed.py           # Comprehensive post-crisis scenario database seeder
├── frontend/
│   ├── src/
│   │   ├── components/   # LeafletMap, Navbar, Sidebar, LoginModal
│   │   ├── pages/        # Dashboard, RouteOptimizer, MLDisruption, Shipments, Disruptions, Vehicles, Bottlenecks, Analytics
│   │   ├── services/     # Axios REST API service layer
│   │   └── App.jsx       # Root React application
│   ├── package.json
│   └── vite.config.js
├── tests/
│   └── test_backend.py   # Automated Pytest suite
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── requirements.txt
└── README.md
```

---

## 🔑 Demo Credentials

For demonstration, use the pre-configured accounts:

| Role | Username | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Logistics Manager** | `admin` | `admin123` | Full Dispatch, Rerouting & Fleet Management |
| **Disaster Authority** | `authority` | `authority123` | Crisis Simulator & Risk Zone Clearance |
| **Transport Operator** | `driver` | `driver123` | Fleet Status & Route Navigation |

---

## 🚀 Quick Start Instructions

### 1. Environment Requirements
- Python 3.10 or higher
- Node.js v18+ and npm

### 2. Backend Setup & Run

```bash
# Navigate to project root
cd reroute-ai

# Install Python dependencies
pip install -r requirements.txt

# Seed Database and Train ML Model
python database/seed.py
python ml/train_model.py

# Run FastAPI Backend Server
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Backend API:** `http://localhost:8000`
- **Swagger Documentation:** `http://localhost:8000/docs`

### 3. Frontend Setup & Run

```bash
# Open a new terminal and navigate to frontend
cd reroute-ai/frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```
- **Frontend Dashboard:** `http://localhost:5173`

---

## 🐳 Docker Deployment

To run both backend and frontend in Docker containers:

```bash
docker-compose up --build
```

---

## 🧪 Automated Testing

Run the automated backend test suite with Pytest:

```bash
python -m pytest tests/test_backend.py
```

---

## 🎯 Step-by-Step College Demo Workflow

1. **Login:** Open `http://localhost:5173`. Click **"Manager"** button to auto-fill `admin / admin123` and sign in.
2. **Dashboard Overview:** Inspect the high-density metrics summary cards, live OpenStreetMap GIS view, top AI recommendations, and detected bottlenecks.
3. **ML Disruption Lab:** Navigate to **"AI ML Disruption"** tab. Adjust sliders (e.g. Traffic 85%, Weather 80%, Road Condition 30%) and click **"Predict Disruption Risk"** to see Random Forest output probability, risk gauge, and delay predictions.
4. **Dynamic Route Optimization:** Navigate to **"Route Optimizer"** tab. Select Origin: *Emergency Medical Supply Center*, Destination: *Apex Trauma & General Hospital*, Priority: *CRITICAL*, Algorithm: *Dijkstra*, Objective: *Safest Path*. Click **"Compute Route"** to view path on map, ETA, fuel cost, and decision rationale.
5. **Crisis Simulation Demo:** Click **"⚡ SIMULATE CRISIS"** button on top header. Confirm crisis event execution. Observe as main corridors are instantly blocked, active medical/relief shipments are dynamically rerouted via safe bypasses, and live recommendations update!
6. **Analytics & Performance:** View **"Analytics & Trends"** tab for Recharts visual graphs comparing standard pre-defined routes vs AI dynamic optimized routes.
