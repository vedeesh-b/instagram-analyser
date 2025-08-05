from fastapi import APIRouter, UploadFile, File
import tempfile
import os
from app.services.zip_parser import zip_parser

router = APIRouter()

@router.post("/parse-zip")
async def parse_zip(file: UploadFile = File(...)):
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, file.filename)

    with open(zip_path, "wb") as buffer:
        buffer.write(await file.read())

    db_path = zip_parser(zip_path)

    return {"message": "Zip parsed", "db_path": db_path}