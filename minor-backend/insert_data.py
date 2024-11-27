from database import insert_health_data

healthcare_data = {
    "intents": [
        {
            "tag": "greeting",
            "patterns": ["Hi", "Hello", "Hey", "How are you", "Is anyone there?"],
            "responses": ["Hello! I'm your healthcare assistant. How can I help you today?"]
        },
        {
            "tag": "symptoms_general",
            "patterns": [
                "I'm not feeling well",
                "I feel sick",
                "What could be wrong with me",
                "I need medical advice"
            ],
            "responses": ["I understand you're not feeling well. Could you please describe your specific symptoms? This will help me provide better guidance."]
        },
        {
            "tag": "headache",
            "patterns": [
                "I have a headache",
                "My head hurts",
                "Having migraine",
                "Head pain",
                "What causes headaches",
                "How to prevent headaches",
                "How to control headaches"
            ],
            "responses": [
                "Here's information about headaches:\n\nCAUSES:\n- Stress and tension\n- Dehydration\n- Lack of sleep\n- Eye strain\n- Sinus problems\n- High blood pressure\n\nPREVENTIVE MEASURES:\n1. Maintain regular sleep schedule\n2. Stay hydrated\n3. Practice stress management\n4. Take regular breaks from screens\n5. Exercise regularly\n\nCONTROL METHODS:\n1. Rest in a quiet, dark room\n2. Apply cold or warm compress\n3. Practice relaxation techniques\n4. Take over-the-counter pain relievers\n5. Massage temples gently\n\nSeek medical attention if headaches are severe or persistent."
            ]
        },
        {
            "tag": "fever",
            "patterns": [
                "I have a fever",
                "My temperature is high",
                "Having chills and fever",
                "Feeling hot",
                "What causes fever",
                "How to prevent fever",
                "How to control fever"
            ],
            "responses": [
                "Here's information about fever:\n\nCAUSES:\n- Viral infections\n- Bacterial infections\n- Inflammatory conditions\n- Heat exhaustion\n- Certain medications\n\nPREVENTIVE MEASURES:\n1. Practice good hygiene\n2. Strengthen immune system\n3. Avoid contact with sick people\n4. Stay hydrated\n5. Get adequate rest\n\nCONTROL METHODS:\n1. Rest well\n2. Stay hydrated\n3. Take acetaminophen if needed\n4. Use lukewarm compress\n5. Wear light clothing\n\nSeek medical attention if fever is high (>103°F) or lasts more than 3 days."
            ]
        },
        {
            "tag": "diabetes",
            "patterns": [
                "Tell me about diabetes",
                "What causes diabetes",
                "How to prevent diabetes",
                "How to control diabetes",
                "Diabetes symptoms",
                "Managing diabetes"
            ],
            "responses": [
                "Here's information about diabetes:\n\nCAUSES:\n- Genetic factors\n- Obesity\n- Physical inactivity\n- Poor diet\n- Age and family history\n\nPREVENTIVE MEASURES:\n1. Maintain healthy weight\n2. Regular exercise\n3. Balanced diet\n4. Limit sugar intake\n5. Regular health checkups\n\nCONTROL METHODS:\n1. Monitor blood sugar regularly\n2. Take prescribed medications\n3. Follow proper diet plan\n4. Exercise regularly\n5. Manage stress levels\n\nConsult healthcare provider for personalized management plan."
            ]
        },
        {
            "tag": "hypertension",
            "patterns": [
                "Tell me about high blood pressure",
                "What causes hypertension",
                "How to prevent high blood pressure",
                "How to control blood pressure",
                "Hypertension symptoms",
                "Managing blood pressure"
            ],
            "responses": [
                "Here's information about hypertension:\n\nCAUSES:\n- Genetic factors\n- Poor diet (high sodium)\n- Obesity\n- Stress\n- Lack of exercise\n- Smoking\n\nPREVENTIVE MEASURES:\n1. Maintain healthy weight\n2. Reduce salt intake\n3. Regular exercise\n4. Limit alcohol\n5. Manage stress\n\nCONTROL METHODS:\n1. Take prescribed medications\n2. Monitor BP regularly\n3. Follow DASH diet\n4. Regular exercise\n5. Reduce stress\n\nRegular monitoring and medication compliance is crucial."
            ]
        },
        {
            "tag": "anxiety",
            "patterns": [
                "Tell me about anxiety",
                "What causes anxiety",
                "How to prevent anxiety",
                "How to control anxiety",
                "Anxiety symptoms",
                "Managing anxiety"
            ],
            "responses": [
                "Here's information about anxiety:\n\nCAUSES:\n- Stress\n- Trauma\n- Genetic factors\n- Chemical imbalances\n- Life changes\n- Health conditions\n\nPREVENTIVE MEASURES:\n1. Regular exercise\n2. Adequate sleep\n3. Healthy diet\n4. Stress management\n5. Social support\n\nCONTROL METHODS:\n1. Deep breathing exercises\n2. Meditation\n3. Professional counseling\n4. Medication if prescribed\n5. Regular exercise\n\nSeek professional help if anxiety interferes with daily life."
            ]
        },
        {
            "tag": "emergency",
            "patterns": [
                "chest pain",
                "difficulty breathing",
                "severe bleeding",
                "unconscious",
                "heart attack",
                "stroke"
            ],
            "responses": [
                "This sounds like a medical emergency. Please call emergency services (911) immediately!"
            ]
        },
        {
            "tag": "disclaimer",
            "patterns": [
                "Are you a doctor",
                "Is this medical advice",
                "Can you diagnose"
            ],
            "responses": [
                "I'm an AI assistant and cannot replace professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment."
            ]
        }
    ]
}

def prepare_training_data():
    training_data = []
    for intent in healthcare_data["intents"]:
        for pattern in intent["patterns"]:
            training_data.append({
                "text": pattern,
                "intent": intent["tag"],
                "response": intent["responses"][0]
            })
    return training_data

def main():
    try:
        # Convert intents to training data format
        training_data = prepare_training_data()
        
        # Insert data into MongoDB
        result = insert_health_data(training_data)
        print(f"Successfully inserted {len(training_data)} training examples")
    except Exception as e:
        print(f"Error inserting data: {str(e)}")

if __name__ == "__main__":
    main()
