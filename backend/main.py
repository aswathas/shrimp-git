from fastapi import FastAPI, File, UploadFile, Form, APIRouter, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import io
import os
import pickle
import pandas as pd
import uvicorn

# Import from our modules
from models import DiagnosisRequest
from sensor_service import get_sensor_data
from image_service import analyze_prawn_image
from report_service import create_pdf_report
model, label_encoder = pickle.load(open("prawn_model.pkl", "rb"))

# Initialize FastAPI app
app = FastAPI()

# Prediction router
predict_router = APIRouter()

@predict_router.post("/predict")
async def predict(
    no_of_prawns: float = Form(...),
    age: float = Form(...),
    food: float = Form(...),
    season: str = Form(...)
):
    try:
        # Encode season
        season_encoded = label_encoder.transform([season])[0]

        # Create feature array
        features = pd.DataFrame([[no_of_prawns, age, food, season_encoded]],
                                columns=['No_of_Prawns', 'Age_of_Pond', 'Food_Intake', 'Season'])

        # Predict
        prediction = model.predict(features)[0]
        return {"prediction": f"{prediction:.2f}"}  # Format to 2 decimal places
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

app.include_router(predict_router)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Prawn Diagnosis API is Running"}

@app.get("/read_sensor")
def read_sensor():
    return get_sensor_data()



@app.post("/diagnose/image")
async def diagnose_image(
    file: UploadFile = File(...),
    confidence: float = Form(40),
    overlap: float = Form(30)
):
    """
    Analyze uploaded image with Roboflow model
    """
    temp_file = f"temp_{file.filename}"
    try:
        # Save uploaded file temporarily
        with open(temp_file, "wb") as f:
            f.write(await file.read())
        
        # Process with analyze_prawn_image function
        result = analyze_prawn_image(temp_file)
        
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"An error occurred: {str(e)}"}
        )
    finally:
        # Clean up the temp file
        if os.path.exists(temp_file):
            os.unlink(temp_file)

@app.post("/diagnosis", response_class=StreamingResponse)
async def diagnose(
    q1: bool = Form(...),
    q2: bool = Form(...),
    q3: bool = Form(...),
    q4: bool = Form(...),
    q5: bool = Form(...),
    q6: bool = Form(...),
    q7: bool = Form(...),
    q8: bool = Form(...),
    q9: bool = Form(...),
    q10: bool = Form(...),
    prawn_image: Optional[UploadFile] = File(None)
):
    """
    Generate full diagnosis report based on questionnaire, IoT data, image analysis,
    and AI-powered recommendations
    """
    diagnosis_data = DiagnosisRequest(
        q1=q1, q2=q2, q3=q3, q4=q4, q5=q5,
        q6=q6, q7=q7, q8=q8, q9=q9, q10=q10
    )
    
    # Get IoT sensor data
    sensor_data = get_sensor_data()
    
    # Process image with Roboflow if provided
    ml_result = None
    if prawn_image:
        try:
            # Create temp file for the image
            temp_path = f"temp_{prawn_image.filename}"
            contents = await prawn_image.read()
            
            with open(temp_path, "wb") as f:
                f.write(contents)
            
            # Use the Roboflow model to analyze the image
            ml_result = analyze_prawn_image(temp_path)
            
            # Cleanup temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            # Continue with the diagnosis even if image processing fails
    
    # Generate PDF report with all data including Gemini AI analysis
    pdf_bytes = await create_pdf_report(diagnosis_data, sensor_data, ml_result)
    
    # Return PDF report for download
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=diagnosis_report.pdf"
        }
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)