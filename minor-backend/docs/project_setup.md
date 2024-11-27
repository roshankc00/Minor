# Health Assistant AI - Project Setup Guide

## 1. Prerequisites

### 1.1 System Requirements
- **Operating System**: Windows 10/11, macOS, Linux
- **Python Version**: 3.8 or higher
- **Minimum Hardware**:
  - 8 GB RAM
  - 20 GB Disk Space
  - Multi-core Processor

### 1.2 Software Dependencies
- Python 3.8+
- pip (Python Package Manager)
- MongoDB 4.4+
- Git (optional, for version control)

## 2. Development Environment Setup

### 2.1 Python Installation
1. Download Python from official website
   - [Python Downloads](https://www.python.org/downloads/)
2. During installation:
   - Check "Add Python to PATH"
   - Select "Install pip"

### 2.2 Virtual Environment Creation
```bash
# Create virtual environment
python -m venv health_assistant_env

# Activate virtual environment
# Windows
health_assistant_env\Scripts\activate

# macOS/Linux
source health_assistant_env/bin/activate
```

### 2.3 MongoDB Installation
#### Windows
1. Download MongoDB Installer
   - [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Run installer
3. Select "Complete" setup type
4. Install MongoDB Compass (recommended)

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## 3. Project Repository Setup

### 3.1 Clone Repository
```bash
git clone https://github.com/yourusername/health-assistant-ai.git
cd health-assistant-ai
```

### 3.2 Environment Configuration
1. Create `.env` file in project root
```
# .env file contents
MONGODB_URL=mongodb://localhost:27017/
DB_NAME=health_assistant
```

### 3.3 Dependency Installation
```bash
# Activate virtual environment first
pip install -r requirements.txt
```

## 4. Database Initialization

### 4.1 Start MongoDB
```bash
# Windows: Use Services
# macOS
brew services start mongodb-community
# Linux
sudo systemctl start mongod
```

### 4.2 Verify MongoDB Connection
```python
from pymongo import MongoClient

try:
    client = MongoClient('mongodb://localhost:27017/')
    client.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"Connection failed: {e}")
```

## 5. Application Setup

### 5.1 Initial Data Preparation
```bash
# Run setup script to insert training data and train model
python setup.py
```

### 5.2 Model Training Verification
- Check console output for:
  - Training data insertion
  - Model training progress
  - Final model accuracy

## 6. Running the Application

### 6.1 Development Server
```bash
# Start FastAPI server with auto-reload
uvicorn main:app --reload
```

### 6.2 Production Deployment
```bash
# Use Gunicorn for production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## 7. Accessing the Application

### 7.1 Web Interface
- Open browser
- Navigate to `http://localhost:8000`

### 7.2 WebSocket Endpoint
- Endpoint: `ws://localhost:8000/ws`
- Can be tested with tools like Postman or custom WebSocket clients

## 8. Troubleshooting

### 8.1 Common Installation Issues
- Ensure virtual environment is activated
- Check Python and pip versions
- Verify MongoDB service is running

### 8.2 Dependency Conflicts
```bash
# Update pip and setuptools
pip install --upgrade pip setuptools

# Clean reinstall dependencies
pip install -r requirements.txt --no-cache-dir
```

## 9. Development Workflow

### 9.1 Code Structure
```
health-assistant-ai/
│
├── docs/                # Documentation
├── static/              # Web interface files
├── tests/               # Unit and integration tests
│
├── main.py              # FastAPI application
├── model.py             # Machine learning model
├── database.py          # Database interactions
├── insert_data.py       # Training data management
├── setup.py             # Initial configuration
└── requirements.txt     # Project dependencies
```

### 9.2 Recommended Workflow
1. Make code changes
2. Run tests
3. Commit to version control
4. Push to repository

## 10. Contribution Guidelines

### 10.1 Code Style
- Follow PEP 8 Python style guide
- Use type hints
- Write docstrings
- Maintain consistent formatting

### 10.2 Testing
- Write unit tests for new features
- Ensure 80%+ code coverage
- Use pytest for testing framework

## 11. Continuous Integration

### 11.1 Recommended CI Tools
- GitHub Actions
- Travis CI
- CircleCI

### 11.2 Sample CI Configuration
```yaml
name: Health Assistant AI CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.8'
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Run tests
      run: pytest tests/
```

## 12. Deployment Considerations

### 12.1 Recommended Hosting
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- DigitalOcean App Platform

### 12.2 Production Checklist
- Set DEBUG=False
- Use production-grade WSGI server
- Configure proper logging
- Set up monitoring
- Implement security best practices
