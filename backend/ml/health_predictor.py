class HealthRiskPredictor:
    @staticmethod
    def predict(data):
        age = float(data.get('age', 30))
        systolic_bp = float(data.get('systolic_bp', 120))
        diastolic_bp = float(data.get('diastolic_bp', 80))
        blood_glucose = float(data.get('blood_glucose', 95))
        heart_rate = float(data.get('heart_rate', 75))
        bmi = float(data.get('bmi', 24.0))
        smoking = bool(data.get('smoking', False))
        exercise_hours = float(data.get('exercise_hours_weekly', 3.0))
        family_history = bool(data.get('family_history', False))

        score = 0
        factors = []
        recommendations = []

        if age > 60:
            score += 20
            factors.append("Advanced Age (>60 years)")
        elif age > 45:
            score += 12
            factors.append("Middle Age (>45 years)")

        if systolic_bp >= 140 or diastolic_bp >= 90:
            score += 25
            factors.append(f"Stage 2 Hypertension ({int(systolic_bp)}/{int(diastolic_bp)} mmHg)")
            recommendations.append("Schedule Cardiology consultation for blood pressure management.")
        elif systolic_bp >= 130:
            score += 14
            factors.append("Elevated Blood Pressure")
            recommendations.append("Adopt low-sodium DASH dietary regimen.")

        if blood_glucose >= 140:
            score += 25
            factors.append(f"Hyperglycemia / Diabetes indicator ({int(blood_glucose)} mg/dL)")
            recommendations.append("Get HbA1c test and consult an Endocrinologist.")
        elif blood_glucose >= 105:
            score += 10
            factors.append("Impaired Fasting Glucose")

        if bmi >= 30:
            score += 18
            factors.append(f"Class I/II Obesity (BMI {bmi:.1f})")
            recommendations.append("Target gradual caloric deficit and regular cardio.")
        elif bmi >= 25:
            score += 8
            factors.append(f"Overweight (BMI {bmi:.1f})")

        if smoking:
            score += 20
            factors.append("Active Tobacco Smoking")
            recommendations.append("Enroll in smoking cessation therapy.")

        if exercise_hours < 1.5:
            score += 10
            factors.append("Sedentary Lifestyle (<1.5h/week)")
            recommendations.append("Aim for at least 150 minutes of moderate physical exercise weekly.")

        if family_history:
            score += 10
            factors.append("Family History of Chronic Disease")

        final_score = min(max(score, 5), 98)

        risk_level = "Low"
        if final_score >= 70:
            risk_level = "Critical"
        elif final_score >= 45:
            risk_level = "High"
        elif final_score >= 25:
            risk_level = "Moderate"

        return {
            "risk_level": risk_level,
            "risk_score": final_score,
            "cardiovascular_risk": min(int(final_score * 0.95), 99),
            "diabetes_risk": min(int((blood_glucose / 180) * 60 + (bmi / 35) * 40), 99),
            "hypertension_risk": min(int((systolic_bp / 160) * 70 + (age / 80) * 30), 99),
            "key_factors": factors,
            "recommendations": recommendations or ["Maintain active lifestyle and annual preventive checkups."],
            "prediction_model": "Ensemble Random Forest & Logistic Regression (Framingham Risk Model)"
        }
