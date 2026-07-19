import os
import base64
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
            # Fallback to base64 if Cloudinary fails
            print(f"Cloudinary upload failed: {e}. Falling back to in-memory Base64 encoding.")
    
    # In-memory Base64 encoding fallback (does not store files locally)
    try:
        contents = await file.read()
        await file.seek(0)
        encoded = base64.b64encode(contents).decode("utf-8")
        content_type = file.content_type or "image/png"
        return f"data:{content_type};base64,{encoded}"
    except Exception as e:
        print(f"Failed to read and encode file: {e}")
        raise e

