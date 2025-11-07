package com.neurofleetx.ai;

import com.neurofleetx.model.Vehicle;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PredictiveMaintenanceService {

    // Machine learning model parameters
    private static final double LEARNING_RATE = 0.01;
    private static final int EPOCHS = 1000;
    
    // Feature weights for the linear regression model
    private Map<String, Double> featureWeights;
    
    public PredictiveMaintenanceService() {
        // Initialize feature weights randomly
        featureWeights = new HashMap<>();
        featureWeights.put("batteryLevel", ThreadLocalRandom.current().nextDouble(-1, 1));
        featureWeights.put("fuelLevel", ThreadLocalRandom.current().nextDouble(-1, 1));
        featureWeights.put("healthScore", ThreadLocalRandom.current().nextDouble(-1, 1));
        featureWeights.put("mileage", ThreadLocalRandom.current().nextDouble(-1, 1));
        featureWeights.put("speed", ThreadLocalRandom.current().nextDouble(-1, 1));
        featureWeights.put("ageFactor", ThreadLocalRandom.current().nextDouble(-1, 1));
    }
    
    /**
     * Predict maintenance needs for a vehicle using a machine learning model
     * @param vehicle The vehicle to analyze
     * @return Detailed prediction results
     */
    public Map<String, Object> predictMaintenance(Vehicle vehicle) {
        Map<String, Object> prediction = new HashMap<>();
        
        // Extract features
        double[] features = extractFeatures(vehicle);
        
        // Apply machine learning model
        double maintenanceScore = predictMaintenanceScore(features);
        
        // Convert score to maintenance probability
        double maintenanceProbability = sigmoid(maintenanceScore);
        
        // Determine if maintenance is needed
        boolean needsMaintenance = maintenanceProbability > 0.7;
        
        // Calculate predicted days until maintenance
        int predictedDays = calculatePredictedDays(maintenanceProbability, vehicle);
        
        // Determine maintenance type based on vehicle characteristics
        String maintenanceType = determineMaintenanceType(vehicle, maintenanceScore);
        
        // Component-specific predictions
        Map<String, Object> componentPredictions = predictComponentHealth(vehicle);
        
        // Recommended actions
        String[] recommendedActions = getRecommendedActions(maintenanceType);
        
        // Confidence score
        double confidence = Math.abs(maintenanceScore) / (Math.abs(maintenanceScore) + 1);
        
        // Populate prediction map
        prediction.put("needsMaintenance", needsMaintenance);
        prediction.put("maintenanceType", maintenanceType);
        prediction.put("predictedDays", predictedDays);
        prediction.put("probability", maintenanceProbability);
        prediction.put("confidence", confidence);
        prediction.put("components", componentPredictions);
        prediction.put("recommendedActions", recommendedActions);
        
        return prediction;
    }
    
    /**
     * Extract features from vehicle data for the ML model
     */
    private double[] extractFeatures(Vehicle vehicle) {
        double batteryLevel = vehicle.getBatteryLevel() != null ? vehicle.getBatteryLevel() : 100.0;
        double fuelLevel = vehicle.getFuelLevel() != null ? vehicle.getFuelLevel() : 100.0;
        int healthScore = vehicle.getHealthScore() != null ? vehicle.getHealthScore() : 80;
        long mileage = vehicle.getMileage() != null ? vehicle.getMileage() : 0;
        double speed = vehicle.getSpeed() != null ? vehicle.getSpeed() : 0;
        
        // Calculate age factor based on mileage (assuming 15,000 miles per year)
        double ageFactor = Math.min(1.0, mileage / 150000.0);
        
        return new double[] {
            batteryLevel / 100.0,     // Normalize to 0-1
            fuelLevel / 100.0,        // Normalize to 0-1
            healthScore / 100.0,      // Normalize to 0-1
            mileage / 200000.0,       // Normalize assuming max 200k miles
            speed / 120.0,            // Normalize assuming max 120 mph
            ageFactor                 // Already normalized
        };
    }
    
    /**
     * Predict maintenance score using linear regression
     */
    private double predictMaintenanceScore(double[] features) {
        double score = 0.0;
        String[] featureNames = {"batteryLevel", "fuelLevel", "healthScore", "mileage", "speed", "ageFactor"};
        
        for (int i = 0; i < features.length; i++) {
            score += features[i] * featureWeights.get(featureNames[i]);
        }
        
        // Add bias term
        score += 0.1;
        
        return score;
    }
    
    /**
     * Sigmoid activation function
     */
    private double sigmoid(double x) {
        return 1.0 / (1.0 + Math.exp(-x));
    }
    
    /**
     * Calculate predicted days until maintenance
     */
    private int calculatePredictedDays(double probability, Vehicle vehicle) {
        // Base calculation: lower probability means more days until maintenance
        int baseDays = (int) (30 + (1 - probability) * 60);
        
        // Adjust based on vehicle health
        if (vehicle.getHealthScore() != null && vehicle.getHealthScore() < 60) {
            baseDays = (int) (baseDays * 0.7); // Sooner maintenance for unhealthy vehicles
        }
        
        // Adjust based on battery level for electric vehicles
        if (vehicle.getType().equals("SEDAN") && vehicle.getBatteryLevel() != null && vehicle.getBatteryLevel() < 20) {
            baseDays = (int) (baseDays * 0.5); // Much sooner maintenance for low battery
        }
        
        return Math.max(1, baseDays);
    }
    
    /**
     * Determine maintenance type based on vehicle characteristics
     */
    private String determineMaintenanceType(Vehicle vehicle, double score) {
        if (vehicle.getType().equals("SEDAN") && vehicle.getBatteryLevel() != null && vehicle.getBatteryLevel() < 25) {
            return "Battery Service";
        } else if (vehicle.getFuelLevel() != null && vehicle.getFuelLevel() < 20) {
            return "Fuel System Check";
        } else if (vehicle.getMileage() != null && vehicle.getMileage() > 50000) {
            return "General Maintenance";
        } else if (vehicle.getHealthScore() != null && vehicle.getHealthScore() < 65) {
            return "Comprehensive Check";
        } else if (score > 0.5) {
            return "Preventive Maintenance";
        } else {
            return "Routine Checkup";
        }
    }
    
    /**
     * Predict component health
     */
    private Map<String, Object> predictComponentHealth(Vehicle vehicle) {
        Map<String, Object> components = new HashMap<>();
        
        // Engine health prediction
        if (vehicle.getFuelLevel() != null) {
            double engineHealth = Math.min(100, Math.max(0, 
                (vehicle.getHealthScore() != null ? vehicle.getHealthScore() : 80) + 
                (vehicle.getFuelLevel() > 50 ? 10 : -20) + 
                (vehicle.getSpeed() != null && vehicle.getSpeed() < 60 ? 5 : -10)));
            components.put("engine", engineHealth > 70 ? "Good" : engineHealth > 50 ? "Attention Needed" : "Immediate Service");
        } else {
            components.put("engine", "N/A - Electric Vehicle");
        }
        
        // Battery health prediction
        if (vehicle.getBatteryLevel() != null) {
            double batteryHealth = vehicle.getBatteryLevel();
            components.put("battery", batteryHealth > 70 ? "Good" : batteryHealth > 30 ? "Monitor" : "Replace Soon");
        } else {
            components.put("battery", "N/A - Fuel Vehicle");
        }
        
        // Tire condition prediction based on mileage
        if (vehicle.getMileage() != null) {
            double tireCondition = Math.min(100, Math.max(0, 100 - (vehicle.getMileage() / 1000)));
            components.put("tires", tireCondition > 70 ? "Good" : tireCondition > 40 ? "Check Wear" : "Replace Soon");
        } else {
            components.put("tires", "Unknown");
        }
        
        // Brake system prediction based on speed
        if (vehicle.getSpeed() != null) {
            double brakeHealth = Math.min(100, Math.max(0, 100 - (vehicle.getSpeed() / 2)));
            components.put("brakes", brakeHealth > 80 ? "Good" : brakeHealth > 60 ? "Inspect" : "Service Required");
        } else {
            components.put("brakes", "Unknown");
        }
        
        return components;
    }
    
    /**
     * Get recommended actions based on maintenance type
     */
    private String[] getRecommendedActions(String maintenanceType) {
        switch (maintenanceType) {
            case "Battery Service":
                return new String[]{
                    "Check battery connections",
                    "Test battery capacity",
                    "Clean terminals",
                    "Inspect cooling system"
                };
            case "Fuel System Check":
                return new String[]{
                    "Inspect fuel pump",
                    "Check fuel filter",
                    "Test injectors",
                    "Examine fuel lines"
                };
            case "General Maintenance":
                return new String[]{
                    "Oil change",
                    "Filter replacement",
                    "Tire rotation",
                    "Fluid level checks"
                };
            case "Comprehensive Check":
                return new String[]{
                    "Full diagnostic scan",
                    "Fluid level checks",
                    "Safety inspection",
                    "Component wear analysis"
                };
            case "Preventive Maintenance":
                return new String[]{
                    "Scheduled maintenance",
                    "System calibration",
                    "Performance optimization",
                    "Software update"
                };
            default:
                return new String[]{
                    "Regular monitoring",
                    "Routine checkup",
                    "Performance evaluation"
                };
        }
    }
    
    /**
     * Train the model with sample data (simplified for demonstration)
     */
    public void trainModel(List<Vehicle> trainingData) {
        // In a real implementation, this would perform actual machine learning training
        // For this demonstration, we'll just adjust weights based on some heuristics
        
        for (int epoch = 0; epoch < EPOCHS; epoch++) {
            for (Vehicle vehicle : trainingData) {
                // Extract features
                double[] features = extractFeatures(vehicle);
                
                // Get current prediction
                double predicted = predictMaintenanceScore(features);
                
                // Calculate target (simplified - in reality this would come from historical data)
                double target = calculateTarget(vehicle);
                
                // Calculate error
                double error = target - predicted;
                
                // Update weights using gradient descent
                String[] featureNames = {"batteryLevel", "fuelLevel", "healthScore", "mileage", "speed", "ageFactor"};
                for (int i = 0; i < features.length; i++) {
                    double newWeight = featureWeights.get(featureNames[i]) + LEARNING_RATE * error * features[i];
                    featureWeights.put(featureNames[i], newWeight);
                }
            }
        }
    }
    
    /**
     * Calculate target value for training (simplified)
     */
    private double calculateTarget(Vehicle vehicle) {
        // This is a simplified heuristic - in reality, this would come from historical maintenance data
        double target = 0.0;
        
        if (vehicle.getHealthScore() != null && vehicle.getHealthScore() < 50) {
            target += 1.0;
        }
        
        if (vehicle.getBatteryLevel() != null && vehicle.getBatteryLevel() < 20) {
            target += 1.5;
        }
        
        if (vehicle.getFuelLevel() != null && vehicle.getFuelLevel() < 15) {
            target += 1.2;
        }
        
        if (vehicle.getMileage() != null && vehicle.getMileage() > 100000) {
            target += 0.8;
        }
        
        return target;
    }
}