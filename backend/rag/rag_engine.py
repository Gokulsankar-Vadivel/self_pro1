from database import get_db_connection

class MedicalRagEngine:
    @staticmethod
    def retrieve_documents(query_text, limit=3):
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM medical_documents").fetchall()
        conn.close()

        query_terms = [w.lower() for w in query_text.split() if len(w) > 2]
        scored_docs = []

        for row in rows:
            doc = dict(row)
            score = 0
            full_text = f"{doc['title']} {doc['category']} {doc['keywords']} {doc['content']}".lower()

            for term in query_terms:
                if term in doc['title'].lower():
                    score += 5
                if term in doc['keywords'].lower():
                    score += 4
                if term in doc['category'].lower():
                    score += 3
                if term in full_text:
                    score += 1

            if score > 0:
                doc['similarity'] = score
                scored_docs.append(doc)

        scored_docs.sort(key=lambda x: x['similarity'], reverse=True)
        return scored_docs[:limit]
