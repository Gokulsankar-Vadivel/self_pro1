from database import get_db_connection
import json

class DatabaseModel:
    @staticmethod
    def dict_from_row(row):
        return dict(row) if row else None

    @staticmethod
    def list_from_rows(rows):
        return [dict(r) for r in rows]

class UserModel(DatabaseModel):
    @staticmethod
    def find_by_email_or_username(identifier):
        conn = get_db_connection()
        row = conn.execute(
            "SELECT * FROM users WHERE email = ? OR username = ?", (identifier, identifier)
        ).fetchone()
        conn.close()
        return UserModel.dict_from_row(row)

    @staticmethod
    def create_user(username, email, password_hash, role):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            (username, email, password_hash, role)
        )
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return user_id

class DoctorModel(DatabaseModel):
    @staticmethod
    def get_all(specialization=None, location=None, hospital_id=None, search=None):
        conn = get_db_connection()
        sql = '''
            SELECT d.*, h.name as hospital_name, h.city as hospital_city 
            FROM doctors d
            LEFT JOIN hospitals h ON d.hospital_id = h.id
            WHERE 1=1
        '''
        params = []
        if specialization:
            sql += " AND LOWER(d.specialization) LIKE ?"
            params.append(f"%{specialization.lower()}%")
        if location:
            sql += " AND (LOWER(h.city) LIKE ? OR LOWER(h.address) LIKE ?)"
            params.extend([f"%{location.lower()}%", f"%{location.lower()}%"])
        if hospital_id:
            sql += " AND d.hospital_id = ?"
            params.append(hospital_id)
        if search:
            sql += " AND (LOWER(d.name) LIKE ? OR LOWER(d.specialization) LIKE ? OR LOWER(h.name) LIKE ?)"
            s = f"%{search.lower()}%"
            params.extend([s, s, s])

        rows = conn.execute(sql, params).fetchall()
        conn.close()
        return DoctorModel.list_from_rows(rows)

class HospitalModel(DatabaseModel):
    @staticmethod
    def get_all(city=None, hospital_type=None, emergency_only=False, department=None, search=None):
        conn = get_db_connection()
        sql = "SELECT * FROM hospitals WHERE 1=1"
        params = []
        if city:
            sql += " AND LOWER(city) LIKE ?"
            params.append(f"%{city.lower()}%")
        if hospital_type:
            sql += " AND type = ?"
            params.append(hospital_type)
        if emergency_only:
            sql += " AND emergency_available = 1"
        if department:
            sql += " AND LOWER(departments) LIKE ?"
            params.append(f"%{department.lower()}%")
        if search:
            sql += " AND (LOWER(name) LIKE ? OR LOWER(address) LIKE ? OR LOWER(departments) LIKE ?)"
            s = f"%{search.lower()}%"
            params.extend([s, s, s])

        rows = conn.execute(sql, params).fetchall()
        conn.close()
        return HospitalModel.list_from_rows(rows)
