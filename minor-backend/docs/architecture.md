# Health Assistant AI - System Architecture

## 1. Overall System Architecture

### 1.1 High-Level Architecture Diagram
```
+-------------------+
|   Web Interface   |
|   (Frontend)      |
+--------+----------+
         |
         | WebSocket
         |
+--------v----------+
|   FastAPI Server  |
|   (main.py)       |
+--------+----------+
         |
         | Intent Classification
         |
+--------v----------+
| Machine Learning  |
| Model (model.py)  |
+--------+----------+
         |
         | Data Storage
         |
+--------v----------+
|    MongoDB        |
| (database.py)     |
+-------------------+
```

## 2. Component Breakdown

### 2.1 Frontend (Web Interface)
- **Technology**: HTML5, JavaScript
- **Location**: `static/index.html`
- **Responsibilities**:
  - Render chat interface
  - Establish WebSocket connection
  - Send user messages
  - Display AI responses

### 2.2 Backend Server (FastAPI)
- **File**: `main.py`
- **Key Responsibilities**:
  - WebSocket endpoint management
  - Request routing
  - CORS middleware
  - Server configuration

#### WebSocket Communication Flow
```python
async def websocket_endpoint(websocket: WebSocket):
    1. Accept WebSocket connection
    2. Receive user message
    3. Preprocess message
    4. Call intent classification model
    5. Retrieve response
    6. Send response back to client
```

### 2.3 Machine Learning Model
- **File**: `model.py`
- **Technology**: TensorFlow, Keras
- **Classification Approach**: Intent-based Classification

#### Model Architecture
```
Input Layer
   ↓
Text Preprocessing
   ↓
TF-IDF Vectorization
   ↓
Neural Network Layers
   - Embedding Layer
   - Dense Layers
   - Dropout Layers
   ↓
Output Layer (Intent Probabilities)
```

#### Key Model Functions
1. `preprocess_text()`
   - Text cleaning
   - Tokenization
   - Lowercasing
   - Removing stopwords

2. `vectorize_text()`
   - Convert text to numerical vectors
   - Use TF-IDF transformation

3. `build_model()`
   - Define neural network architecture
   - Compile with appropriate loss function
   - Configure optimization strategy

### 2.4 Database Layer
- **File**: `database.py`
- **Technology**: PyMongo
- **Responsibilities**:
  - MongoDB connection
  - Training data management
  - Interaction logging

#### Database Schema
```json
{
  "intent": "headache",
  "queries": ["I have a headache", "My head hurts"],
  "response": "Detailed medical advice...",
  "categories": ["pain", "neurological"]
}
```

### 2.5 Data Insertion
- **File**: `insert_data.py`
- **Responsibilities**:
  - Prepare training datasets
  - Insert health condition data
  - Manage intent classifications

## 3. Data Flow

### 3.1 User Interaction Workflow
1. User sends message via WebSocket
2. Message preprocessed
3. Intent classified by ML model
4. Relevant response retrieved
5. Response sent back to user

### 3.2 Model Training Workflow
1. Load training data from MongoDB
2. Preprocess text data
3. Vectorize text
4. Split into training/validation sets
5. Train neural network
6. Save trained model
7. Evaluate model performance

## 4. Technical Specifications

### 4.1 Technology Stack
- **Backend**: Python 3.8+
- **Web Framework**: FastAPI
- **ML Framework**: TensorFlow
- **Database**: MongoDB
- **Communication**: WebSocket

### 4.2 Performance Considerations
- Async WebSocket handling
- Efficient text preprocessing
- Vectorization optimization
- Model inference speed

## 5. Security Measures

### 5.1 Data Protection
- Environment-based configuration
- No hardcoded credentials
- Secure WebSocket connections

### 5.2 Error Handling
- Graceful WebSocket disconnections
- Comprehensive logging
- Model prediction confidence thresholds

## 6. Scalability Strategies

### 6.1 Model Improvement
- Continuous learning mechanism
- Regular model retraining
- Expanding intent categories

### 6.2 Infrastructure
- Containerization ready
- Microservices architecture
- Horizontal scaling support

## 7. Monitoring and Logging

### 7.1 Performance Metrics
- Model accuracy tracking
- Response time monitoring
- Intent classification confidence

### 7.2 Logging Strategy
- User interaction logs
- Model prediction logs
- Error and exception tracking

## 8. Future Evolution

### 8.1 Planned Enhancements
- Advanced NLP techniques
- User authentication
- More comprehensive health categories
- Real-time model updating

### 8.2 Potential Extensions
- Multi-language support
- Integration with medical databases
- Advanced diagnostic capabilities
