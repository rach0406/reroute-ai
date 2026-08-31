import sys
import os
from datetime import datetime

# Adjust Python path to allow backend imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.database.session import engine, init_db, SessionLocal
from app.database.models import User, Location, Road, Vehicle, Commodity, Shipment, Disruption, RiskZone, Recommendation

def seed_database():
    init_db()
    db = SessionLocal()

    # Clear existing data
    db.query(User).delete()
    db.query(Location).delete()
    db.query(Road).delete()
    db.query(Vehicle).delete()
    db.query(Commodity).delete()
    db.query(Shipment).delete()
    db.query(Disruption).delete()
    db.query(RiskZone).delete()
    db.query(Recommendation).delete()
    db.commit()

    print("Seeding Users...")
    users = [
        User(username="admin", password_hash="admin123", role="Logistics Manager", full_name="Sarah Jenkins (Logistics Chief)"),
        User(username="authority", password_hash="authority123", role="Disaster Management Authority", full_name="Cmdr. David Vance (NDMA Coordinator)"),
        User(username="driver", password_hash="driver123", role="Driver", full_name="Marcus Reed (Lead Operator)")
    ]
    db.add_all(users)

    print("Seeding Locations...")
    locations = [
        Location(id=1, name="Central Logistics Hub", type="Warehouse", latitude=17.4350, longitude=78.4480, address="Zone A Logistics Park", contact_person="Logistics Desk"),
        Location(id=2, name="Emergency Medical Supply Center", type="Medical Supply Center", latitude=17.4420, longitude=78.4680, address="Pharma Complex, Gate 3", contact_person="Dr. Aris Thorne"),
        Location(id=3, name="Regional Food Reserve", type="Food Distribution Center", latitude=17.4120, longitude=78.4200, address="Grain Depot 12", contact_person="P. Sharma"),
        Location(id=4, name="Strategic Fuel Depot", type="Fuel Depot", latitude=17.3950, longitude=78.4100, address="Refinery Terminal West", contact_person="Terminal Mgr"),
        Location(id=5, name="Apex Trauma & General Hospital", type="Hospital", latitude=17.4100, longitude=78.4850, address="Medical Hill, Rd 1", contact_person="Emergency Ward ER"),
        Location(id=6, name="St. Jude Relief Hospital", type="Hospital", latitude=17.4520, longitude=78.5020, address="North East Medical Corridor", contact_person="Triage Chief"),
        Location(id=7, name="Sector-4 Flood Relief Camp", type="Relief Camp", latitude=17.3650, longitude=78.4720, address="Stadium Shelter Complex", contact_person="Camp Commander"),
        Location(id=8, name="East District Emergency Hub", type="Emergency Center", latitude=17.4280, longitude=78.5200, address="Civil Defense Post 4", contact_person="Capt. Miller"),
        Location(id=9, name="North Disaster Shelter", type="Relief Camp", latitude=17.4780, longitude=78.4550, address="Community Center Grounds", contact_person="Volunteers Unit"),
        Location(id=10, name="South Distribution Point", type="Distribution Hub", latitude=17.3450, longitude=78.5100, address="South Highway Gate", contact_person="Dispatch Team")
    ]
    db.add_all(locations)
    db.commit()

    print("Seeding Roads...")
    roads = [
        # (id, name, src, tgt, dist_km, time_min, traffic, cond, cap, risk, blocked, fuel)
        Road(id=1, name="NH-65 Main Expressway", source_id=1, target_id=5, distance=8.5, travel_time=14.0, traffic_level=0.4, road_condition=0.9, capacity=0.9, risk_score=0.15, blocked=False, fuel_cost=2.2),
        Road(id=2, name="Medical Corridor Blvd", source_id=2, target_id=6, distance=6.2, travel_time=11.0, traffic_level=0.7, road_condition=0.6, capacity=0.7, risk_score=0.45, blocked=False, fuel_cost=1.8),
        Road(id=3, name="Riverbank Bypass Road", source_id=3, target_id=7, distance=10.4, travel_time=18.0, traffic_level=0.8, road_condition=0.4, capacity=0.5, risk_score=0.75, blocked=False, fuel_cost=3.1),
        Road(id=4, name="Ring Road South Express", source_id=4, target_id=10, distance=14.1, travel_time=20.0, traffic_level=0.3, road_condition=0.85, capacity=0.95, risk_score=0.2, blocked=False, fuel_cost=3.5),
        Road(id=5, name="North Relief Arterial", source_id=1, target_id=9, distance=7.8, travel_time=13.0, traffic_level=0.35, road_condition=0.8, capacity=0.85, risk_score=0.25, blocked=False, fuel_cost=2.0),
        Road(id=6, name="East Transit Highway", source_id=2, target_id=8, distance=9.0, travel_time=15.0, traffic_level=0.5, road_condition=0.75, capacity=0.8, risk_score=0.3, blocked=False, fuel_cost=2.4),
        Road(id=7, name="Central Ring Connector", source_id=5, target_id=8, distance=5.5, travel_time=9.0, traffic_level=0.6, road_condition=0.8, capacity=0.85, risk_score=0.35, blocked=False, fuel_cost=1.4),
        Road(id=8, name="District Bridge Road", source_id=3, target_id=5, distance=7.1, travel_time=16.0, traffic_level=0.9, road_condition=0.2, capacity=0.3, risk_score=0.85, blocked=False, fuel_cost=2.8),
        Road(id=9, name="Hub-to-Medical Link", source_id=1, target_id=2, distance=3.2, travel_time=6.0, traffic_level=0.2, road_condition=0.95, capacity=1.0, risk_score=0.1, blocked=False, fuel_cost=0.8),
        Road(id=10, name="Food-to-Fuel Corridor", source_id=3, target_id=4, distance=4.0, travel_time=7.0, traffic_level=0.25, road_condition=0.9, capacity=0.95, risk_score=0.15, blocked=False, fuel_cost=1.0),
        Road(id=11, name="East-North Perimeter", source_id=8, target_id=9, distance=11.2, travel_time=19.0, traffic_level=0.3, road_condition=0.85, capacity=0.9, risk_score=0.2, blocked=False, fuel_cost=2.9),
        Road(id=12, name="South-Apex Expressway", source_id=7, target_id=5, distance=8.0, travel_time=15.0, traffic_level=0.65, road_condition=0.7, capacity=0.75, risk_score=0.4, blocked=False, fuel_cost=2.1),
        Road(id=13, name="North-Medical Direct", source_id=9, target_id=6, distance=6.0, travel_time=10.0, traffic_level=0.4, road_condition=0.8, capacity=0.85, risk_score=0.25, blocked=False, fuel_cost=1.5),
        Road(id=14, name="East-St.Jude Connector", source_id=8, target_id=6, distance=4.8, travel_time=8.0, traffic_level=0.3, road_condition=0.9, capacity=0.9, risk_score=0.2, blocked=False, fuel_cost=1.2),
        Road(id=15, name="South-Hub Diagonal", source_id=10, target_id=7, distance=5.8, travel_time=11.0, traffic_level=0.5, road_condition=0.75, capacity=0.8, risk_score=0.35, blocked=False, fuel_cost=1.5)
    ]
    db.add_all(roads)
    db.commit()

    print("Seeding Vehicles...")
    vehicles = [
        Vehicle(id=1, vehicle_code="V-101", type="Truck", capacity_tons=15.0, fuel_level_percent=92.0, current_lat=17.4350, current_lng=78.4480, status="Available"),
        Vehicle(id=2, vehicle_code="V-102", type="Medical Van", capacity_tons=4.5, fuel_level_percent=78.0, current_lat=17.4420, current_lng=78.4680, status="In Transit"),
        Vehicle(id=3, vehicle_code="V-103", type="Fuel Tanker", capacity_tons=22.0, fuel_level_percent=85.0, current_lat=17.3950, current_lng=78.4100, status="Available"),
        Vehicle(id=4, vehicle_code="V-104", type="Emergency Vehicle", capacity_tons=3.5, fuel_level_percent=95.0, current_lat=17.4100, current_lng=78.4850, status="Assigned"),
        Vehicle(id=5, vehicle_code="V-105", type="Truck", capacity_tons=25.0, fuel_level_percent=64.0, current_lat=17.4120, current_lng=78.4200, status="Available"),
        Vehicle(id=6, vehicle_code="V-106", type="Medical Van", capacity_tons=5.0, fuel_level_percent=88.0, current_lat=17.4520, current_lng=78.5020, status="In Transit")
    ]
    db.add_all(vehicles)

    print("Seeding Commodities...")
    commodities = [
        Commodity(id=1, name="Emergency Medical Supplies & Vaccines", category="CRITICAL", unit="tons", priority_score=98),
        Commodity(id=2, name="Clean Drinking Water Packets", category="HIGH", unit="tons", priority_score=88),
        Commodity(id=3, name="Diesel & Gas Generators", category="HIGH", unit="tons", priority_score=85),
        Commodity(id=4, name="Ready-to-Eat Ration Kits", category="HIGH", unit="tons", priority_score=82),
        Commodity(id=5, name="Temporary Tents & Blankets", category="MEDIUM", unit="tons", priority_score=65),
        Commodity(id=6, name="Hygiene & Sanitation Supplies", category="MEDIUM", unit="tons", priority_score=60),
        Commodity(id=7, name="Non-Perishable General Cargo", category="LOW", unit="tons", priority_score=35)
    ]
    db.add_all(commodities)
    db.commit()

    print("Seeding Shipments...")
    shipments = [
        Shipment(id=1, shipment_code="SHP-101", commodity_name="Emergency Medical Supplies & Vaccines", category="CRITICAL", quantity=3.2, origin_id=2, destination_id=5, urgency_level="CRITICAL", priority_score=98.0, deadline_hours=2.0, vehicle_id=2, status="In Transit", current_eta_minutes=22.0, current_risk_category="LOW", route_nodes=[2, 9, 1, 5]),
        Shipment(id=2, shipment_code="SHP-102", commodity_name="Clean Drinking Water Packets", category="HIGH", quantity=12.0, origin_id=3, destination_id=7, urgency_level="HIGH", priority_score=88.0, deadline_hours=4.0, vehicle_id=5, status="Pending", current_eta_minutes=35.0, current_risk_category="HIGH", route_nodes=[3, 7]),
        Shipment(id=3, shipment_code="SHP-103", commodity_name="Diesel & Gas Generators", category="HIGH", quantity=18.0, origin_id=4, destination_id=8, urgency_level="HIGH", priority_score=85.0, deadline_hours=6.0, vehicle_id=3, status="Assigned", current_eta_minutes=28.0, current_risk_category="LOW", route_nodes=[4, 10, 7, 5, 8]),
        Shipment(id=4, shipment_code="SHP-104", commodity_name="Trauma Surgical Kits", category="CRITICAL", quantity=2.5, origin_id=2, destination_id=6, urgency_level="CRITICAL", priority_score=96.0, deadline_hours=1.5, vehicle_id=6, status="In Transit", current_eta_minutes=15.0, current_risk_category="MEDIUM", route_nodes=[2, 6]),
        Shipment(id=5, shipment_code="SHP-105", commodity_name="Ready-to-Eat Ration Kits", category="HIGH", quantity=10.0, origin_id=3, destination_id=9, urgency_level="HIGH", priority_score=82.0, deadline_hours=5.0, vehicle_id=1, status="In Transit", current_eta_minutes=26.0, current_risk_category="LOW", route_nodes=[3, 10, 4, 1, 9]),
        Shipment(id=6, shipment_code="SHP-106", commodity_name="Temporary Tents & Blankets", category="MEDIUM", quantity=8.0, origin_id=1, destination_id=7, urgency_level="MEDIUM", priority_score=65.0, deadline_hours=12.0, vehicle_id=None, status="Pending", current_eta_minutes=38.0, current_risk_category="MEDIUM", route_nodes=[1, 5, 12, 7]),
        Shipment(id=7, shipment_code="SHP-107", commodity_name="Hygiene & Sanitation Supplies", category="MEDIUM", quantity=6.5, origin_id=1, destination_id=10, urgency_level="MEDIUM", priority_score=60.0, deadline_hours=16.0, vehicle_id=None, status="Pending", current_eta_minutes=42.0, current_risk_category="LOW", route_nodes=[1, 5, 8, 11, 10]),
        Shipment(id=8, shipment_code="SHP-108", commodity_name="Non-Perishable General Cargo", category="LOW", quantity=14.0, origin_id=1, destination_id=8, urgency_level="LOW", priority_score=35.0, deadline_hours=24.0, vehicle_id=None, status="Pending", current_eta_minutes=30.0, current_risk_category="LOW", route_nodes=[1, 5, 8])
    ]
    db.add_all(shipments)

    print("Seeding Disruptions...")
    disruptions = [
        Disruption(
            id=1,
            disruption_code="DIS-301",
            title="Riverbank Flash Flood Inundation",
            location_description="District Bridge Road (River Crossing)",
            affected_road_ids=[8],
            severity="CRITICAL",
            status="Active",
            start_time=datetime.utcnow(),
            expected_duration_hours=18.0,
            cause="Severe storm surge causing river overflow",
            traffic_impact_factor=0.9
        ),
        Disruption(
            id=2,
            disruption_code="DIS-302",
            title="Medical Corridor Debris Accumulation",
            location_description="Medical Corridor Blvd (Near Gate 4)",
            affected_road_ids=[2],
            severity="MEDIUM",
            status="Active",
            start_time=datetime.utcnow(),
            expected_duration_hours=6.0,
            cause="Infrastructure debris reducing lane availability",
            traffic_impact_factor=0.6
        )
    ]
    db.add_all(disruptions)

    print("Seeding Risk Zones...")
    risk_zones = [
        RiskZone(
            id=1,
            name="Central River Inundation Zone",
            risk_level="CRITICAL",
            center_lat=17.4050,
            center_lng=78.4500,
            radius_km=3.2,
            geojson_polygon={
                "type": "Polygon",
                "coordinates": [[
                    [78.4350, 17.4150],
                    [78.4650, 17.4150],
                    [78.4600, 17.3950],
                    [78.4300, 17.3950],
                    [78.4350, 17.4150]
                ]]
            }
        ),
        RiskZone(
            id=2,
            name="Eastern Debris Hazard Sector",
            risk_level="HIGH",
            center_lat=17.4350,
            center_lng=78.5100,
            radius_km=2.5,
            geojson_polygon={
                "type": "Polygon",
                "coordinates": [[
                    [78.4950, 17.4450],
                    [78.5250, 17.4450],
                    [78.5200, 17.4250],
                    [78.4900, 17.4250],
                    [78.4950, 17.4450]
                ]]
            }
        ),
        RiskZone(
            id=3,
            name="South Buffer Clearance Zone",
            risk_level="MEDIUM",
            center_lat=17.3550,
            center_lng=78.4900,
            radius_km=2.0,
            geojson_polygon={
                "type": "Polygon",
                "coordinates": [[
                    [78.4750, 17.3650],
                    [78.5050, 17.3650],
                    [78.5000, 17.3450],
                    [78.4700, 17.3450],
                    [78.4750, 17.3650]
                ]]
            }
        )
    ]
    db.add_all(risk_zones)

    print("Seeding Recommendations...")
    recommendations = [
        Recommendation(
            id=1,
            title="Reroute Critical Shipment SHP-102 via Ring Road South",
            category="Route Reroute",
            description="District Bridge Road (Road 8) is impassable due to flash flooding. Reroute drinking water shipment SHP-102 via Food-to-Fuel Corridor (Road 10) and Ring Road South. Avoids 85% disruption probability.",
            urgency="CRITICAL",
            status="Pending"
        ),
        Recommendation(
            id=2,
            title="Prioritize Medical Transport Vehicle V-104 Dispatch",
            category="Priority Dispatch",
            description="Shipment SHP-101 contains emergency medical vaccines with 2-hour deadline. Assign high-speed Medical Van V-104 directly.",
            urgency="HIGH",
            status="Pending"
        ),
        Recommendation(
            id=3,
            title="Bottleneck Warning: Riverbank Bypass Junction",
            category="Bottleneck Warning",
            description="High congestion (80%) and low road capacity (40%) on Riverbank Bypass Road. Restrict non-essential heavy transport.",
            urgency="MEDIUM",
            status="Pending"
        )
    ]
    db.add_all(recommendations)
    db.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
