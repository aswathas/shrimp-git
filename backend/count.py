from roboflow import Roboflow
import supervision as sv

rf = Roboflow(api_key="zy1lJUUkKDHmUs8MfPDA")
project = rf.workspace().project("shrimp-disease-detection")
model = project.version(3).model

result = model.predict("./../prawn.jpg", confidence=40, overlap=30).json()

detections = sv.Detections.from_roboflow(result)

print(len(detections))

# filter by class
detections = detections[detections.class_id == 0]
print(len(detections))