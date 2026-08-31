from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # "Logistics Manager", "Disaster Management Authority", "Driver"
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # Warehouse, Hospital, Relief Camp, Emergency Center, Fuel Depot
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String)
    contact_person = Column(String)

class Road(Base):
    __tablename__ = "roads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    source_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    target_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    distance = Column(Float, nullable=False) # km
    travel_time = Column(Float, nullable=False) # minutes
    traffic_level = Column(Float, default=0.1) # 0.0 to 1.0
    road_condition = Column(Float, default=1.0) # 0.1 (destroyed) to 1.0 (perfect)
    capacity = Column(Float, default=1.0) # 0.1 to 1.0
    risk_score = Column(Float, default=0.1) # 0.0 to 1.0
    blocked = Column(Boolean, default=False)
    fuel_cost = Column(Float, default=1.0) # liters
    is_bidirectional = Column(Boolean, default=True)

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_code = Column(String, unique=True, index=True, nullable=False)
    type = Column(String, nullable=False) # Truck, Medical Van, Fuel Tanker, Emergency Vehicle
    capacity_tons = Column(Float, nullable=False)
    fuel_level_percent = Column(Float, default=100.0)
    current_lat = Column(Float, nullable=False)
    current_lng = Column(Float, nullable=False)
    status = Column(String, default="Available") # Available, Assigned, In Transit, Maintenance

class Commodity(Base):
    __tablename__ = "commodities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    unit = Column(String, default="tons")
    priority_score = Column(Integer, default=50)

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    shipment_code = Column(String, unique=True, index=True, nullable=False)
    commodity_name = Column(String, nullable=False)
    category = Column(String, nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    quantity = Column(Float, nullable=False)
    origin_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    destination_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    urgency_level = Column(String, default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    priority_score = Column(Float, default=80.0)
    deadline_hours = Column(Float, default=12.0)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    status = Column(String, default="Pending") # Pending, Assigned, In Transit, Delayed, Delivered, At Risk
    current_eta_minutes = Column(Float, default=45.0)
    current_risk_category = Column(String, default="LOW")
    route_nodes = Column(JSON, nullable=True)

class Disruption(Base):
    __tablename__ = "disruptions"

    id = Column(Integer, primary_key=True, index=True)
    disruption_code = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    location_description = Column(String)
    affected_road_ids = Column(JSON) # List of road IDs
    severity = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String, default="Active") # Active, Resolved
    start_time = Column(DateTime, default=datetime.utcnow)
    expected_duration_hours = Column(Float, default=24.0)
    cause = Column(String) # Flood, Landslide, Earthquake, Bridge Damage, Traffic Gridlock
    traffic_impact_factor = Column(Float, default=0.5)

class RiskZone(Base):
    __tablename__ = "risk_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    risk_level = Column(String, nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    radius_km = Column(Float, default=2.0)
    geojson_polygon = Column(JSON, nullable=True)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # Route Reroute, Priority Dispatch, Capacity Alert, Bottleneck Warning
    description = Column(Text, nullable=False)
    urgency = Column(String, default="HIGH") # CRITICAL, HIGH, MEDIUM
    status = Column(String, default="Pending") # Pending, Applied, Dismissed
    created_at = Column(DateTime, default=datetime.utcnow)
