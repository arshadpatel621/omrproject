from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import cv2
import io
import requests

app = FastAPI(title="OMR Service")

class ProcessBody(BaseModel):
    imageUrl: Optional[str] = None
    questions: int

@app.get("/health")
async def health():
    return {"ok": True}

@app.post("/process")
async def process(body: ProcessBody, file: Optional[UploadFile] = File(None)):
    # Load image either from URL or uploaded file
    img_bytes = None
    if body.imageUrl and body.imageUrl.startswith("http"):
        r = requests.get(body.imageUrl, timeout=20)
        r.raise_for_status()
        img_bytes = r.content
    elif file is not None:
        img_bytes = await file.read()
    else:
        # In demo mode, return all 'N' answers
        return {"answers": ["N"] * body.questions}

    # Decode image
    image_array = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if img is None:
        return {"answers": ["N"] * body.questions}

    # Minimal placeholder logic: threshold then return 'N' for all
    # TODO: implement real OMR: deskew (Hough lines), contour detection, grid mapping, bubble classification
    return {"answers": ["N"] * body.questions}
