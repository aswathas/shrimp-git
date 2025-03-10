from roboflow import Roboflow
import supervision as sv
import cv2
import numpy as np

rf = Roboflow(api_key="zy1lJUUkKDHmUs8MfPDA")
project = rf.workspace().project("shrimp-disease-detection")
model = project.version(3).model

result = model.predict("./../prawn.jpg", confidence=40, overlap=30).json()

# Extract predictions from the result
predictions = result["predictions"]

# Check if any objects were detected
if not predictions:
    print("No objects detected in the image.")
    # Save the original image without annotations
    image = cv2.imread("./../prawn.jpg")
    cv2.imwrite("./../no_detections.jpg", image)
    print("Original image saved as 'no_detections.jpg'")
    exit(0)

labels = [item["class"] for item in predictions]

# Extract bounding boxes, confidence scores, and class ids
boxes = []
confidences = []
class_ids = []
class_name_to_id = {}  # To map class names to numeric ids

for i, pred in enumerate(predictions):
    # Get box coordinates in xyxy format
    x1 = pred["x"] - pred["width"] / 2
    y1 = pred["y"] - pred["height"] / 2
    x2 = pred["x"] + pred["width"] / 2
    y2 = pred["y"] + pred["height"] / 2
    boxes.append([x1, y1, x2, y2])
    
    # Get confidence
    confidences.append(pred["confidence"])
    
    # Track class ids
    class_name = pred["class"]
    if class_name not in class_name_to_id:
        class_name_to_id[class_name] = len(class_name_to_id)
    class_ids.append(class_name_to_id[class_name])

# Create Detections object
detections = sv.Detections(
    xyxy=np.array(boxes),
    confidence=np.array(confidences),
    class_id=np.array(class_ids)
)

# Create annotators
bounding_box_annotator = sv.BoxAnnotator()
label_annotator = sv.LabelAnnotator()

# Load and annotate the image
image = cv2.imread("./../prawn.jpg")

annotated_image = bounding_box_annotator.annotate(
    scene=image, detections=detections)
annotated_image = label_annotator.annotate(
    scene=annotated_image, detections=detections, labels=labels)

# Save the annotated image instead of displaying it
cv2.imwrite("./../annotated_prawn.jpg", annotated_image)
print(f"Annotated image saved as 'annotated_prawn.jpg'")

# Print detection count
print(f"Detected {len(detections)} prawns/objects")
print(f"Classes detected: {set(labels)}")