from roboflow import Roboflow
import cv2
import numpy as np
from typing import Dict, Any

# Initialize Roboflow model
rf = Roboflow(api_key="bc8vO1NdxZLVYHVEWBun")
project = rf.workspace().project("shrimp-disease-detection")
model = project.version(3).model

def analyze_prawn_image(image_path: str) -> Dict[str, Any]:
    """
    Analyze prawn image using Roboflow model for disease detection
    """
    try:
        # Process with Roboflow model
        result = model.predict(image_path, confidence=40, overlap=30).json()
        
        # Extract predictions
        predictions = result.get("predictions", [])
        
        # If no predictions found
        if not predictions:
            return {
                "classification": "No issues detected",
                "confidence": 0.0,
                "detected_count": 0,
                "details": []
            }
        
        # Extract disease labels
        labels = [item["class"] for item in predictions]
        
        # Count occurrences of each disease
        disease_counts = {}
        for label in labels:
            if label in disease_counts:
                disease_counts[label] += 1
            else:
                disease_counts[label] = 1
        
        # Determine overall classification based on detected diseases
        primary_issue = max(disease_counts.items(), key=lambda x: x[1])[0]
        
        # Calculate average confidence
        avg_confidence = sum(item["confidence"] for item in predictions) / len(predictions)
        
        return {
            "classification": f"Detected: {primary_issue}",
            "confidence": avg_confidence,
            "detected_count": len(predictions),
            "disease_counts": disease_counts,
            "details": predictions
        }
    except Exception as e:
        print(f"Error analyzing image: {str(e)}")
        return {
            "classification": "Error analyzing image",
            "confidence": 0.0,
            "error": str(e)
        }