# Multi-stage Dockerfile for Trading Assistant
FROM python:3.11-slim as base

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    ffmpeg \
    libsndfile1 \
    portaudio19-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt* ./
COPY backend/requirements.txt ./backend/
COPY voice/requirements.txt ./voice/

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir -r backend/requirements.txt && \
    pip install --no-cache-dir -r voice/requirements.txt

FROM base as backend

COPY backend/ ./backend/
COPY db/ ./db/

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM base as frontend

RUN pip install --no-cache-dir streamlit

COPY frontend/ ./frontend/

EXPOSE 8501

CMD ["streamlit", "run", "frontend/app/main.py", "--server.port=8501", "--server.address=0.0.0.0"]

FROM base as voice

RUN apt-get update && apt-get install -y \
    espeak \
    && rm -rf /var/lib/apt/lists/*

COPY voice/ ./voice/

EXPOSE 8001

CMD ["python", "voice/main.py"]

FROM base as celery-worker

COPY backend/ ./backend/
COPY db/ ./db/

ENV C_FORCE_ROOT=true

CMD ["celery", "-A", "backend.tasks.celery_app", "worker", "--loglevel=info"]

FROM base as celery-beat

COPY backend/ ./backend/
COPY db/ ./db/

ENV C_FORCE_ROOT=true

CMD ["celery", "-A", "backend.tasks.celery_app", "beat", "--loglevel=info"]

FROM base as development

RUN pip install --no-cache-dir \
    streamlit \
    jupyter \
    ipython

COPY . .

EXPOSE 8000 8501 8001 5555

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]