from fpdf import FPDF
from typing import Optional, Dict
from models import DiagnosisRequest

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
        
        # Add detailed disease counts if available
        if 'disease_counts' in ml_result:
            pdf.ln(3)
            pdf.cell(200, 8, txt=f"Detected issues:", ln=True)
            for disease, count in ml_result['disease_counts'].items():
                pdf.cell(200, 8, txt=f"- {disease}: {count}", ln=True)
        
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
        if 'disease_counts' in ml_result and ml_result['disease_counts']:
            diseases = ", ".join(f"{disease} (x{count})" for disease, count in ml_result['disease_counts'].items())
            ml_comment = f"Image analysis detected: {diseases}."
        else:
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