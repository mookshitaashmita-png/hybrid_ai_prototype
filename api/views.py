
# Create your views here.
import os
import joblib
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Load model once at import time
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model.pkl')

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None
    print("Warning: failed to load model:", e)

@csrf_exempt
def predict(request):
    if request.method != "POST":
        return JsonResponse({"error":"POST required"}, status=405)

    try:
        payload = json.loads(request.body.decode('utf-8'))
        message = payload.get('message', '')
    except Exception:
        return JsonResponse({"error":"invalid json"}, status=400)

    # Convert message to numeric feature: length
    length = len(message or "")
    if model is None:
        return JsonResponse({"error":"model not loaded"}, status=500)

    # Prepare feature, predict
    X = np.array([[length]])
    pred = model.predict(X).tolist()  # returns list
    response = {
        "message": message,
        "length": length,
        "prediction": pred[0]
    }
    return JsonResponse(response)
