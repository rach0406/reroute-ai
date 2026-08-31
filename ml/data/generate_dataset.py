import os
import numpy as np
import pandas as pd

def generate_transportation_dataset(filepath="C:/Users/rachita.sabbathi/.gemini/antigravity/scratch/reroute-ai/ml/data/transportation_data.csv", num_samples=2000, seed=42):
    np.random.seed(seed)
    
    # Generate realistic post-crisis transportation features
    traffic_level = np.random.uniform(0.1, 1.0, num_samples) # 1.0 = gridlock
    road_condition = np.random.uniform(0.1, 1.0, num_samples) # 0.1 = severe damage, 1.0 = perfect
    weather_severity = np.random.uniform(0.0, 1.0, num_samples) # 1.0 = flood/cyclone
    road_capacity = np.random.uniform(0.2, 1.0, num_samples) # fraction of max throughput
    historical_delay = np.random.exponential(15, num_samples) + traffic_level * 25
    distance = np.random.uniform(2.0, 85.0, num_samples) # km
    demand_level = np.random.uniform(0.2, 1.0, num_samples)
    vehicle_load = np.random.uniform(0.3, 1.0, num_samples)
    previous_disruptions = np.random.poisson(1.5, num_samples)
    
    # Calculate disruption risk score probability
    risk_logits = (
        2.5 * traffic_level +
        3.0 * (1.0 - road_condition) +
        3.5 * weather_severity +
        2.0 * (1.0 - road_capacity) +
        0.05 * historical_delay +
        0.4 * previous_disruptions +
        1.5 * (vehicle_load * (1.0 - road_capacity)) -
        4.0
    )
    
    # Sigmoid function to convert logits to probabilities
    disruption_prob = 1.0 / (1.0 + np.exp(-risk_logits))
    
    # Binary label with probabilistic outcome
    disruption = (np.random.uniform(0, 1, num_samples) < disruption_prob).astype(int)
    
    df = pd.DataFrame({
        "traffic_level": np.round(traffic_level, 3),
        "road_condition": np.round(road_condition, 3),
        "weather_severity": np.round(weather_severity, 3),
        "road_capacity": np.round(road_capacity, 3),
        "historical_delay": np.round(historical_delay, 1),
        "distance": np.round(distance, 1),
        "demand_level": np.round(demand_level, 3),
        "vehicle_load": np.round(vehicle_load, 3),
        "previous_disruptions": previous_disruptions,
        "disruption_prob": np.round(disruption_prob, 3),
        "disruption": disruption
    })
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    df.to_csv(filepath, index=False)
    print(f"Dataset saved to {filepath} with {num_samples} records. Disruption positive rate: {df['disruption'].mean():.2%}")
    return df

if __name__ == "__main__":
    generate_transportation_dataset()
