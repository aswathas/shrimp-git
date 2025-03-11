import google.generativeai as genai
from typing import Dict, Any, Optional
import os
from models import DiagnosisRequest
from dotenv import load_dotenv

# Configure the Gemini API
# Load environment variables from .env file
load_dotenv()

# Get the API key from environment variables
API_KEY = os.getenv("GEMINI_API_KEY")

# Configure the Gemini API
genai.configure(api_key=API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-2.0-flash-thinking-exp-01-21')

def create_prompt(diagnosis_data: DiagnosisRequest, 
                 sensor_data: Dict[str, Any], 
                 ml_result: Optional[Dict[str, Any]] = None) -> str:
    """
    Creates a detailed prompt for Gemini based on all available prawn data
    """
    # Format questionnaire responses
    questions = [
        "Is the growth rate good?",
        "Is the food intake good?",
        "Are the weather conditions good?",
        "Is the pond affected by whitegutt previously?",
        "Is the plankton growth more or optimal?",
        "Are minerals provided 3-4 times every month?",
        "Is the estimated count matched with manual count?",
        "Are nearby ponds more affected by viruses?",
        "Are prawns losing shell at the correct time?",
        "Any shell loose cases in pond?"
    ]
    
    questionnaire = []
    for i, (k, v) in enumerate(diagnosis_data.dict().items()):
        questionnaire.append(f"Q{i+1}: {questions[i]} - {'Yes' if v else 'No'}")
    
    # Format sensor data
    sensor_info = f"""
pH: {sensor_data['pH']} (Ideal: 7.0-8.5)
TDS: {sensor_data['tds']} ppm (Ideal: 1000-1500 ppm)
Temperature: {sensor_data['temperature']}°C (Ideal: 28-32°C)
"""
    
    # Format ML detection results if available
    ml_info = ""
    if ml_result:
        ml_info = f"\nImage Analysis Results:\n"
        ml_info += f"- Main finding: {ml_result.get('classification', 'Unknown')}\n"
        ml_info += f"- Confidence: {ml_result.get('confidence', 0) * 100:.1f}%\n"
        
        if 'disease_counts' in ml_result and ml_result['disease_counts']:
            ml_info += "- Detected diseases/conditions:\n"
            for disease, count in ml_result['disease_counts'].items():
                ml_info += f"  * {disease}: {count} instances\n"
    
    # Create the complete prompt for Gemini
    prompt = f"""
You are an expert aquaculture consultant specializing in prawn/shrimp farming. Based on the following data, provide a comprehensive analysis of the current prawn health and water conditions, and recommend specific actions including medications if needed.

## QUESTIONNAIRE RESPONSES:
{chr(10).join(questionnaire)}

## SENSOR READINGS:
{sensor_info}
{ml_info}

Please provide:

1. ANALYSIS OF PRAWN HEALTH:
   - Assess overall health condition
   - Identify potential disease concerns
   - Evaluate nutritional status
   - Growth assessment

2. WATER QUALITY ASSESSMENT:
   - pH status and implications
   - TDS evaluation
   - Temperature suitability
   - Overall water quality rating

3. DIAGNOSES & ISSUES:
   - List all probable health issues in order of severity
   - Note connections between symptoms and environmental factors

4. DETAILED RECOMMENDATIONS:
   - Specific medication names with dosages for any detected diseases
   - Water quality adjustments needed
   - Feeding regime modifications if required
   - Mineral/supplement recommendations
   - Preventive measures

5. TIMELINE:
   - Expected recovery timeframe
   - Follow-up steps and monitoring recommendations

Be specific about medication names, chemicals and treatments. Include dosage information when recommending treatments.
<instruction give all the data in text format dont add header md language>
"""
    return prompt

async def generate_analysis(diagnosis_data: DiagnosisRequest, 
                           sensor_data: Dict[str, Any], 
                           ml_result: Optional[Dict[str, Any]] = None) -> str:
    """
    Generates a comprehensive analysis using Gemini AI
    """
    try:
        prompt = create_prompt(diagnosis_data, sensor_data, ml_result)
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating Gemini analysis: {str(e)}")
        return "AI analysis unavailable. Please consult with an aquaculture specialist."