# School Management System (SaaS)

A comprehensive, AI-powered, multi-tenant SaaS school management system.

## Features

- Multi-tenant architecture (multiple schools)
- Student, Teacher, and Class management
- Attendance tracking
- Grading and assessments
- Fee management
- AI-powered insights
- Real-time notifications
- Subscription-based billing

## Tech Stack

**Backend:**
- Python 3.13
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic

**Frontend:**
- React 18
- Vite
- Tailwind CSS

**AI:**
- OpenAI GPT-4
- LangChain

## Project Structure

school-management-system/
├── backend/ # FastAPI backend
├── frontend/ # React frontend (coming soon)
├── docs/ # Documentation
└── docker/ # Docker configurations


## Getting Started

### Prerequisites

- Python 3.13
- Docker & Docker Compose
- Node.js 18+ (for frontend)

### Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload


### Docker Setup

docker-compose up -d


## Documentation

See [docs/technical-documentation.md](docs/technical-documentation.md) for complete technical documentation.

## License

Proprietary - All Rights Reserved

## Author

Favour Augustine
