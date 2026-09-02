import os
from rag.rag_engine import MedicalRagEngine

class GeminiAssistantService:
    @staticmethod
    def answer_symptoms(message, conversation_history=None, patient_context=None):
        retrieved_docs = MedicalRagEngine.retrieve_documents(message, limit=3)
        api_key = os.getenv('GEMINI_API_KEY')

        # Check emergency keywords
        lower = message.lower()
        is_emergency = any(kw in lower for kw in [
            'chest pain', 'heart attack', 'cannot breathe', 'stroke', 'slurred speech',
            'unconscious', 'severe bleeding', 'anaphylaxis', 'worst headache'
        ])

        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                
                rag_text = "\n\n".join([f"[{d['title']}]\n{d['content']}" for d in retrieved_docs])
                prompt = f"""You are a clinical AI assistant for Telemedicine.
Context:
{rag_text}

User Query: {message}

Provide safe clinical guidance, recommend relevant specialist, and include disclaimer."""

                response = client.models.generate_content(
                    model='gemini-3.7-flash',
                    contents=prompt
                )
                return {
                    "response": response.text,
                    "isEmergency": is_emergency,
                    "retrievedDocs": retrieved_docs,
                    "suggestedSpecialist": "Cardiologist" if "chest" in lower else "General Physician"
                }
            except Exception as e:
                print(f"Gemini call error: {e}")

        # Fallback RAG response
        if is_emergency:
            reply = "⚠️ URGENT MEDICAL WARNING: Your reported symptoms indicate a potential medical emergency. Please dial emergency services (108 / 911) or proceed immediately to the nearest emergency department."
        else:
            top_doc = retrieved_docs[0] if retrieved_docs else None
            reply = f"Based on clinical knowledge guidelines{' (' + top_doc['title'] + ')' if top_doc else ''}: Your symptoms suggest mild to moderate condition. Please consult a licensed doctor if symptoms persist."

        return {
            "response": reply,
            "isEmergency": is_emergency,
            "retrievedDocs": retrieved_docs,
            "suggestedSpecialist": "Emergency Physician" if is_emergency else "General Physician"
        }
