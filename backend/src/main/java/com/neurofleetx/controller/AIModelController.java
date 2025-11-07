package com.neurofleetx.controller;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.service.VehicleService;
import com.neurofleetx.ai.PredictiveMaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5507")
public class AIModelController {

    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private PredictiveMaintenanceService predictiveMaintenanceService;

    // Predictive maintenance model using machine learning
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
            
            // Use advanced AI prediction algorithm based on vehicle metrics
            Map<String, Object> prediction = predictiveMaintenanceService.predictMaintenance(vehicle);
            
            response.put("vehicleId", vehicleId);
            response.put("prediction", prediction);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Prediction failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Batch prediction for all vehicles using advanced ML model
    @GetMapping("/predict/maintenance/all")
    public ResponseEntity<Map<String, Object>> predictAllVehicles() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            Map<Long, Map<String, Object>> predictions = new HashMap<>();
            
            for (Vehicle vehicle : vehicles) {
                Map<String, Object> prediction = predictiveMaintenanceService.predictMaintenance(vehicle);
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
    
    // Train the AI model with current vehicle data
    @PostMapping("/train")
    public ResponseEntity<Map<String, Object>> trainModel() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            predictiveMaintenanceService.trainModel(vehicles);
            
            response.put("message", "AI model trained successfully with " + vehicles.size() + " vehicles");
            response.put("vehicleCount", vehicles.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Model training failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}