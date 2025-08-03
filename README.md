# Trading Assistant

A comprehensive trading assistant with AI-powered analysis, voice processing, and real-time market data.

## 🏗️ Architecture

```
trading-assistant/
├── backend/           # FastAPI + LangChain + Celery
├── frontend/          # Streamlit UI
├── voice/            # Whisper + gTTS/ElevenLabs
├── db/               # TimescaleDB schema
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- API keys for:
  - OpenAI (for LangChain)
  - Alpha Vantage (market data)
  - News API (news feeds)
  - ElevenLabs (voice synthesis)

### Environment Setup

1. Create a `.env` file:
```bash
cp .env.example .env
```

2. Add your API keys to `.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
NEWS_API_KEY=your_news_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Running the Application

#### Option 1: Full Stack (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Option 2: Individual Services
```bash
# Backend only
docker-compose up backend -d

# Frontend only
docker-compose up frontend -d

# Voice processing only
docker-compose up voice -d
```

## 📊 Services

| Service | Port | Description |
|---------|------|-------------|
| Backend API | 8000 | FastAPI with LangChain |
| Frontend | 8501 | Streamlit UI |
| Voice Service | 8001 | Whisper + gTTS |
| Database | 5432 | TimescaleDB |
| Redis | 6379 | Message queue |
| Flower | 5555 | Celery monitoring |

## 🔧 Development

### Building Individual Stages

```bash
# Backend only
docker build --target backend -t trading-backend .

# Frontend only
docker build --target frontend -t trading-frontend .

# Voice processing only
docker build --target voice -t trading-voice .

# Development environment
docker build --target development -t trading-dev .
```

### Running Development Environment

```bash
# Build and run development stage
docker run -it --rm \
  -p 8000:8000 \
  -p 8501:8501 \
  -p 8001:8001 \
  -v $(pwd):/app \
  trading-dev
```

## 📁 Project Structure

### Backend (`backend/`)
- `main.py` - FastAPI application
- `agents/` - LangChain agents and chains
- `data_ingestion/` - Market data and news feeds
- `tasks/` - Celery background tasks

### Frontend (`frontend/`)
- `app/` - Streamlit application
- Dashboard for trading insights
- Real-time data visualization

### Voice (`voice/`)
- `transcribe.py` - Whisper speech-to-text
- `synthesize.py` - gTTS/ElevenLabs text-to-speech

### Database (`db/`)
- `schema.sql` - TimescaleDB schema
- Time-series data for market analysis

## 🔍 Monitoring

### Health Checks
- Backend: `http://localhost:8000/health`
- Database: Automatic PostgreSQL health check
- Redis: Automatic Redis health check

### Celery Monitoring
- Flower UI: `http://localhost:5555`
- Monitor task queues and workers

## 🛠️ Customization

### Adding New Dependencies

1. Update the appropriate `requirements.txt`:
   - `requirements.txt` - Core dependencies
   - `backend/requirements.txt` - Backend dependencies
   - `voice/requirements.txt` - Voice processing dependencies

2. Rebuild the Docker image:
```bash
docker-compose build
```

### Environment Variables

All services use environment variables for configuration. See `.env.example` for available options.

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8000, 8501, 5432, 6379 are available
2. **API key errors**: Verify all API keys are set in `.env`
3. **Database connection**: Wait for TimescaleDB to fully start (health check)

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs voice

# Follow logs in real-time
docker-compose logs -f
```

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## 📈 Next Steps

1. Implement your trading strategies in `backend/agents/`
2. Add data ingestion sources in `backend/data_ingestion/`
3. Create custom Streamlit components in `frontend/app/`
4. Enhance voice processing in `voice/`
5. Extend the database schema in `db/schema.sql`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.