from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from fpdf import FPDF
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagnosisRequest(BaseModel):
    q1: bool
    q2: bool
    q3: bool
    q4: bool
    q5: bool
    q6: bool
    q7: bool
    q8: bool
    q9: bool
    q10: bool

def get_iot_sensor_data():
    return {
        "pH": 8.1,
        "tds": 1200,
        "temperature": 28.5,
    }

def analyze_prawn_image(image_path: str):
    return {
        "classification": "Prawn looks healthy",
        "confidence": 0.92
    }

def create_pdf_report(
    diagnosis_data: DiagnosisRequest,
    sensor_data: dict,
    ml_result: Optional[dict] = None
) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="Prawn Diagnosis Report", ln=True, align="C")
    pdf.ln(5)
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(200, 10, txt="User Responses:", ln=True)
    pdf.set_font("Arial", size=12)
    answers_dict = diagnosis_data.dict()
    question_texts = [
        "1) Is the growth rate good?",
        "2) Is the food intake good?",
        "3) Are the weather conditions good?",
        "4) Is the pond affected by whitegutt previously?",
        "5) Is the plankton growth more or optimal?",
        "6) Are minerals provided 3-4 times every month?",
        "7) Is the estimated count matched with manual count?",
        "8) Are nearby ponds more affected by viruses?",
        "9) Are prawns losing shell at the correct time?",
        "10) Any shell loose cases in pond?",
    ]
    for idx, (key, value) in enumerate(answers_dict.items()):
        answer_str = "Yes" if value else "No"
        pdf.cell(200, 8, txt=f"{question_texts[idx]} => {answer_str}", ln=True)
    pdf.ln(5)
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(200, 10, txt="IoT Sensor Data:", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 8, txt=f"pH: {sensor_data['pH']}", ln=True)
    pdf.cell(200, 8, txt=f"TDS: {sensor_data['tds']}", ln=True)
    pdf.cell(200, 8, txt=f"Temperature: {sensor_data['temperature']}°C", ln=True)
    pdf.ln(5)
    if ml_result:
        pdf.set_font("Arial", size=12, style="B")
        pdf.cell(200, 10, txt="ML Image Analysis:", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 8, txt=f"Classification: {ml_result['classification']}", ln=True)
        pdf.cell(200, 8, txt=f"Confidence: {ml_result['confidence'] * 100:.2f}%", ln=True)
        pdf.ln(5)
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(200, 10, txt="Diagnosis / Recommendation:", ln=True)
    pdf.set_font("Arial", size=12)
    recommendation_text = generate_diagnosis_text(diagnosis_data, sensor_data, ml_result)
    pdf.multi_cell(0, 8, txt=recommendation_text)
    pdf_bytes = pdf.output(dest="S").encode("latin-1")
    return pdf_bytes

def generate_diagnosis_text(
    diagnosis_data: DiagnosisRequest,
    sensor_data: dict,
    ml_result: Optional[dict] = None
) -> str:
    score = 0
    for answer_value in diagnosis_data.dict().values():
        if answer_value:
            score += 1
    if sensor_data["pH"] < 7.0 or sensor_data["pH"] > 9.0:
        score -= 1
    ml_comment = ""
    if ml_result:
        ml_comment = f"Image suggests: {ml_result['classification']} (Conf. {ml_result['confidence']:.2f})."
    if score >= 7:
        diagnosis = (
            "Overall conditions appear to be good. "
            "Continue monitoring feeding and water parameters regularly. "
        )
    else:
        diagnosis = (
            "Some parameters may need attention. Verify feeding, check for possible disease signs, "
            "and ensure water quality is within proper ranges. "
        )
    return f"{ml_comment}\n\n{diagnosis}"

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
    diagnosis_data = DiagnosisRequest(
        q1=q1, q2=q2, q3=q3, q4=q4, q5=q5,
        q6=q6, q7=q7, q8=q8, q9=q9, q10=q10
    )
    ml_result = None
    temp_path = None
    if prawn_image is not None:
        temp_path = f"temp_{prawn_image.filename}"
        with open(temp_path, "wb") as f:
            f.write(await prawn_image.read())
        ml_result = analyze_prawn_image(temp_path)
        if os.path.exists(temp_path):
            os.remove(temp_path)
    sensor_data = get_iot_sensor_data()
    pdf_bytes = create_pdf_report(diagnosis_data, sensor_data, ml_result)
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=diagnosis_report.pdf"
        }
    )
