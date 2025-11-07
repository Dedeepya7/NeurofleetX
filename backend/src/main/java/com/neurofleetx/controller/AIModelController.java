package com.neurofleetx.controller;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIModelController {

    @Autowired
    private VehicleService vehicleService;

    // Simple predictive maintenance model
    @PostMapping("/predict/maintenance")
    public ResponseEntity<Map<String, Object>> predictMaintenance(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get vehicle data
            Long vehicleId = Long.valueOf(requestData.get("vehicleId").toString());
            Vehicle vehicle = vehicleService.getVehicleById(vehicleId).orElse(null);
            
            if (vehicle == null) {
                response.put("error", "Vehicle not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Simple AI prediction algorithm based on vehicle metrics
            Map<String, Object> prediction = predictMaintenanceNeeds(vehicle);
            
            response.put("vehicleId", vehicleId);
            response.put("prediction", prediction);
            response.put("confidence", 0.85); // Simulated confidence score
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Prediction failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Batch prediction for all vehicles
    @GetMapping("/predict/maintenance/all")
    public ResponseEntity<Map<String, Object>> predictAllVehicles() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            Map<Long, Map<String, Object>> predictions = new HashMap<>();
            
            for (Vehicle vehicle : vehicles) {
                Map<String, Object> prediction = predictMaintenanceNeeds(vehicle);
                predictions.put(vehicle.getId(), prediction);
            }
            
            response.put("predictions", predictions);
            response.put("count", vehicles.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Batch prediction failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Simple predictive algorithm based on vehicle metrics
    private Map<String, Object> predictMaintenanceNeeds(Vehicle vehicle) {
        Map<String, Object> prediction = new HashMap<>();
        
        // Calculate health score based on various factors
        double batteryLevel = vehicle.getBatteryLevel() != null ? vehicle.getBatteryLevel() : 100.0;
        double fuelLevel = vehicle.getFuelLevel() != null ? vehicle.getFuelLevel() : 100.0;
        int healthScore = vehicle.getHealthScore() != null ? vehicle.getHealthScore() : 80;
        long mileage = vehicle.getMileage() != null ? vehicle.getMileage() : 0;
        double speed = vehicle.getSpeed() != null ? vehicle.getSpeed() : 0;
        
        // Simple AI logic for demonstration
        boolean needsMaintenance = false;
        String maintenanceType = "None";
        int predictedDays = 30; // Default days until maintenance
        
        // Battery electric vehicles
        if (vehicle.getType().equals("SEDAN") && batteryLevel < 20) {
            needsMaintenance = true;
            maintenanceType = "Battery Service";
            predictedDays = (int) (batteryLevel / 2); // Lower battery = sooner maintenance
        }
        // Fuel vehicles
        else if (fuelLevel < 15) {
            needsMaintenance = true;
            maintenanceType = "Fuel System Check";
            predictedDays = (int) (fuelLevel / 1.5);
        }
        // High mileage vehicles
        else if (mileage > 50000 && healthScore < 70) {
            needsMaintenance = true;
            maintenanceType = "General Maintenance";
            predictedDays = Math.max(1, 90 - (int)(mileage / 1000));
        }
        // Low health score
        else if (healthScore < 60) {
            needsMaintenance = true;
            maintenanceType = "Comprehensive Check";
            predictedDays = Math.max(1, healthScore / 2);
        }
        
        // Component-specific predictions
        Map<String, Object> componentPredictions = new HashMap<>();
        componentPredictions.put("engine", healthScore > 70 ? "Good" : healthScore > 50 ? "Attention Needed" : "Immediate Service");
        componentPredictions.put("battery", batteryLevel > 50 ? "Good" : batteryLevel > 20 ? "Monitor" : "Replace Soon");
        componentPredictions.put("tires", mileage > 40000 ? "Check Wear" : "Good");
        componentPredictions.put("brakes", speed > 80 ? "Inspect" : "Good");
        
        prediction.put("needsMaintenance", needsMaintenance);
        prediction.put("maintenanceType", maintenanceType);
        prediction.put("predictedDays", predictedDays);
        prediction.put("components", componentPredictions);
        prediction.put("recommendedActions", getRecommendedActions(maintenanceType));
        
        return prediction;
    }
    
    private String[] getRecommendedActions(String maintenanceType) {
        switch (maintenanceType) {
            case "Battery Service":
                return new String[]{"Check battery connections", "Test battery capacity", "Clean terminals"};
            case "Fuel System Check":
                return new String[]{"Inspect fuel pump", "Check fuel filter", "Test injectors"};
            case "General Maintenance":
                return new String[]{"Oil change", "Filter replacement", "Tire rotation"};
            case "Comprehensive Check":
                return new String[]{"Full diagnostic scan", "Fluid level checks", "Safety inspection"};
            default:
                return new String[]{"Regular monitoring", "Routine checkup"};
        }
    }
}