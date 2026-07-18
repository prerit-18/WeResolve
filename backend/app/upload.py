import os
import shutil
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from dotenv import load_dotenv

load_dotenv()

# Check if Cloudinary is configured
cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
api_key = os.getenv("CLOUDINARY_API_KEY")
api_secret = os.getenv("CLOUDINARY_API_SECRET")

is_cloudinary_configured = bool(cloud_name and api_key and api_secret)

if is_cloudinary_configured:
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )

async def upload_image(file: UploadFile) -> str:
    if is_cloudinary_configured:
        try:
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(file.file)
            return result.get("secure_url")
        except Exception as e:
            # Fallback to local if Cloudinary fails
            print(f"Cloudinary upload failed: {e}. Falling back to local storage.")
    
    # Local Storage Fallback
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1] or ".png"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Write to local directory
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Return local URL matching mounted StaticFiles
    return f"http://localhost:8000/uploads/{unique_filename}"
