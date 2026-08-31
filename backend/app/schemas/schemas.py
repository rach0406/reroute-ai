from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    full_name: str

class LoginResponse(BaseModel):
    success: bool
    token: str
    user: UserResponse
    message: str

# Location & Network Schemas
class LocationSchema(BaseModel):
    id: int
    name: str
    type: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    contact_person: Optional[str] = None

    class Config:
        from_attributes = True

class RoadSchema(BaseModel):
    id: int
    name: str
    source_id: int
    target_id: int
    distance: float
    travel_time: float
    traffic_level: float
    road_condition: float
    capacity: float
    risk_score: float
    blocked: bool
    fuel_cost: float
    is_bidirectional: bool

    class Config:
        from_attributes = True

class VehicleSchema(BaseModel):
    id: int
    vehicle_code: str
    type: str
    capacity_tons: float
    fuel_level_percent: float
    current_lat: float
    current_lng: float
    status: str

    class Config:
        from_attributes = True

class CommoditySchema(BaseModel):
    id: int
    name: str
    category: str
    unit: str
    priority_score: int

    class Config:
        from_attributes = True

# Shipment Schemas
class ShipmentCreateRequest(BaseModel):
    commodity_name: str
    category: str = "HIGH"
    quantity: float
    origin_id: int
    destination_id: int
    urgency_level: str = "HIGH"
    deadline_hours: float = 6.0
    vehicle_id: Optional[int] = None

class ShipmentResponse(BaseModel):
    id: int
    shipment_code: str
    commodity_name: str
    category: str
    quantity: float
    origin_id: int
    destination_id: int
    urgency_level: str
    priority_score: float
    deadline_hours: float
    vehicle_id: Optional[int] = None
    status: str
    current_eta_minutes: float
    current_risk_category: str
    route_nodes: Optional[List[int]] = None

    class Config:
        from_attributes = True

# Disruption & Crisis Simulation Schemas
class DisruptionCreateRequest(BaseModel):
    title: str
    location_description: str
    affected_road_ids: List[int]
    severity: str = "HIGH"
    cause: str = "Extreme Weather"

class DisruptionResponse(BaseModel):
    id: int
    disruption_code: str
    title: str
    location_description: str
    affected_road_ids: List[int]
    severity: str
    status: str
    cause: str
    traffic_impact_factor: float

    class Config:
        from_attributes = True

class CrisisSimulateRequest(BaseModel):
    crisis_type: str = "Severe Regional Flood" # Flood, Landslide, Infrastructure Damage
    blocked_road_ids: Optional[List[int]] = None

class CrisisSimulateResponse(BaseModel):
    success: bool
    crisis_title: str
    blocked_roads_count: int
    affected_shipments_count: int
    rerouted_shipments_count: int
    message: str

# ML Prediction Schemas
class MLPredictRequest(BaseModel):
    traffic_level: float = Field(0.7, ge=0.0, le=1.0)
    road_condition: float = Field(0.5, ge=0.0, le=1.0)
    weather_severity: float = Field(0.6, ge=0.0, le=1.0)
    road_capacity: float = Field(0.5, ge=0.0, le=1.0)
    historical_delay: float = 15.0
    distance: float = 10.0
    demand_level: float = 0.8
    vehicle_load: float = 0.8
    previous_disruptions: int = 2

class MLPredictResponse(BaseModel):
    disruption_probability: float
    risk_category: str
    predicted_delay_minutes: float
    features_evaluated: Dict[str, Any]
    recommendations: List[str]

# Route Optimization Schemas
class RouteOptimizeRequest(BaseModel):
    source_id: int
    target_id: int
    commodity_priority: str = "HIGH"
    algorithm: str = "Dijkstra" # Dijkstra or A*
    objective: str = "balanced" # fastest, safest, lowest_cost, balanced

class RouteOptimizeResponse(BaseModel):
    success: bool
    algorithm_used: str
    objective: str
    commodity_priority: str
    path_nodes: List[int]
    path_coordinates: List[Dict[str, Any]]
    traversed_road_ids: List[int]
    total_distance_km: float
    estimated_eta_minutes: float
    average_risk_score: float
    risk_category: str
    total_fuel_liters: float
    estimated_cost_usd: float
    decision_rationale: str
    message: Optional[str] = None

# Bottlenecks & Recommendations Schemas
class BottleneckItem(BaseModel):
    road_id: int
    road_name: str
    bottleneck_score: float
    traffic_pressure: float
    capacity_constraint: float
    disruption_risk: float
    recommendation: str

class BottleneckResponse(BaseModel):
    bottlenecks: List[BottleneckItem]

class RecommendationResponse(BaseModel):
    id: int
    title: str
    category: str
    description: str
    urgency: str
    status: str

    class Config:
        from_attributes = True

# Dashboard Summary Schema
class DashboardSummaryResponse(BaseModel):
    active_shipments: int
    completed_deliveries: int
    at_risk_shipments: int
    road_disruptions: int
    critical_deliveries: int
    avg_delivery_delay_minutes: float
    total_estimated_cost_usd: float
    network_risk_score: float

# Risk Zone Schema
class RiskZoneSchema(BaseModel):
    id: int
    name: str
    risk_level: str
    center_lat: float
    center_lng: float
    radius_km: float
    geojson_polygon: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
