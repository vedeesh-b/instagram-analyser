from fastapi import APIRouter, UploadFile, File
import os
from app.services.zip_parser import zip_parser
import sqlite3

router = APIRouter()

@router.post("/parse-zip")
async def parse_zip(file: UploadFile = File(...)):
    temp_upload_path = os.path.join('data', file.filename)
    os.makedirs('data', exist_ok=True)

    with open(temp_upload_path, "wb") as buffer:
        buffer.write(await file.read())

    db_path = os.path.join('data', 'instagram-analytics.db')
    final_path = zip_parser(temp_upload_path, db_path)

    os.remove(temp_upload_path)

    return {"message": "Zip parsed", "db_path": final_path}

@router.get("/people-not-following-user")
async def get_people_not_following():
    db_path = os.path.join('data', 'instagram-analytics.db')
    if not os.path.exists(db_path):
        return {"error": "no ZIP file uploaded"}
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT f.username, f.link
        FROM following f
        LEFT JOIN followers r
        ON f.username = r.username
        WHERE r.username IS NULL
    """)

    results = cursor.fetchall()
    conn.close()

    return [{"username": row[0], "href": row[1]} for row in results]
    
