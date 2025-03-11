from fpdf import FPDF
from typing import Optional, Dict, Any
from models import DiagnosisRequest
from gemini_service import generate_analysis

async def create_pdf_report(
    diagnosis_data: DiagnosisRequest,
    sensor_data: Dict[str, Any],
    ml_result: Optional[Dict[str, Any]] = None
) -> bytes:
    # Get AI-generated analysis
    ai_analysis = await generate_analysis(diagnosis_data, sensor_data, ml_result)
    
    # Create PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="Prawn Diagnosis Report", ln=True, align="C")
    pdf.ln(5)
    
    # User responses section
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
        "10) Any shell loose cases in pond?"
    ]
    
    for idx, (key, value) in enumerate(answers_dict.items()):
        answer_str = "Yes" if value else "No"
        pdf.cell(200, 8, txt=f"{question_texts[idx]} => {answer_str}", ln=True)
    pdf.ln(5)
    
    # IoT sensor data section
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(200, 10, txt="IoT Sensor Data:", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 8, txt=f"pH: {sensor_data['pH']}", ln=True)
    pdf.cell(200, 8, txt=f"TDS: {sensor_data['tds']}", ln=True)
    pdf.cell(200, 8, txt=f"Temperature: {sensor_data['temperature']}°C", ln=True)
    pdf.ln(5)
    
    # ML image analysis section (if available)
    if ml_result:
        pdf.set_font("Arial", size=12, style="B")
        pdf.cell(200, 10, txt="Image Analysis:", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 8, txt=f"Classification: {ml_result['classification']}", ln=True)
        pdf.cell(200, 8, txt=f"Confidence: {ml_result['confidence'] * 100:.2f}%", ln=True)
        
        if 'disease_counts' in ml_result:
            pdf.ln(3)
            pdf.cell(200, 8, txt=f"Detected issues:", ln=True)
            for disease, count in ml_result['disease_counts'].items():
                pdf.cell(200, 8, txt=f"- {disease}: {count}", ln=True)
        pdf.ln(5)
    
    # AI-generated analysis section
    pdf.set_font("Arial", size=12, style="B")
    pdf.cell(200, 10, txt="AI Expert Analysis:", ln=True)
    pdf.set_font("Arial", size=10)
    
    # Process AI analysis text
    if ai_analysis:
        # Handle potential Unicode characters
        safe_text = ai_analysis.encode('latin-1', errors='replace').decode('latin-1')
        
        # Split into paragraphs and add to PDF
        paragraphs = safe_text.split('\n\n')
        for paragraph in paragraphs:
            if paragraph.strip():
                pdf.multi_cell(0, 5, txt=paragraph.strip())
                pdf.ln(2)
    
    # Generate PDF bytes - FPDF2 returns bytes directly, no need to encode
    try:
        # With FPDF2, output() already returns a bytearray, so no need to encode
        pdf_bytes = pdf.output(dest="S")
        return pdf_bytes
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        # Fallback to simpler PDF on error
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=14)
        pdf.cell(200, 10, txt="Prawn Diagnosis Report", ln=True, align="C")
        pdf.cell(200, 10, txt="Error creating detailed report.", ln=True)
        return pdf.output(dest="S")  # Again, no need to encode