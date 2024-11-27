import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D
import numpy as np
from database import get_training_data
import pickle
import os

class HealthAssistantModel:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.label_encoder = None
        self.max_sequence_length = 20
        self.vocab_size = 1000
        self.embedding_dim = 16
        self.model_path = "health_model.h5"
        self.tokenizer_path = "tokenizer.pickle"
        self.label_encoder_path = "label_encoder.pickle"

    def preprocess_data(self, training_data):
        # Extract texts and labels
        texts = [item["text"] for item in training_data]
        intents = [item["intent"] for item in training_data]
        responses = [item["response"] for item in training_data]

        # Tokenize texts
        self.tokenizer = Tokenizer(num_words=self.vocab_size, oov_token="<OOV>")
        self.tokenizer.fit_on_texts(texts)
        sequences = self.tokenizer.texts_to_sequences(texts)
        padded_sequences = pad_sequences(sequences, maxlen=self.max_sequence_length, truncating='post')

        # Encode labels
        self.label_encoder = {intent: i for i, intent in enumerate(set(intents))}
        encoded_labels = np.array([self.label_encoder[intent] for intent in intents])
        num_classes = len(self.label_encoder)

        # Create response lookup
        self.response_lookup = {intent: resp for intent, resp in zip(intents, responses)}

        return padded_sequences, encoded_labels, num_classes

    def build_model(self, num_classes):
        self.model = Sequential([
            Embedding(self.vocab_size, self.embedding_dim, input_length=self.max_sequence_length),
            GlobalAveragePooling1D(),
            Dense(16, activation='relu'),
            Dense(num_classes, activation='softmax')
        ])
        
        self.model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )

    def train(self):
        # Get training data from MongoDB
        training_data = get_training_data()
        
        # Preprocess data
        X, y, num_classes = self.preprocess_data(training_data)
        
        # Build and train model
        self.build_model(num_classes)
        history = self.model.fit(
            X, y,
            epochs=100,
            validation_split=0.2,
            verbose=1
        )
        
        # Save model and tokenizer
        self.save_model()
        
        # Return training metrics
        return history.history, {
            "accuracy": history.history['accuracy'][-1],
            "loss": history.history['loss'][-1]
        }

    def predict(self, text):
        if not self.model or not self.tokenizer or not self.label_encoder:
            self.load_model()
        
        # Preprocess input text
        sequence = self.tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequence, maxlen=self.max_sequence_length)
        
        # Get prediction
        prediction = self.model.predict(padded)
        predicted_class_idx = np.argmax(prediction, axis=1)[0]
        
        # Convert prediction to intent
        reverse_label_encoder = {v: k for k, v in self.label_encoder.items()}
        predicted_intent = reverse_label_encoder[predicted_class_idx]
        
        # Get corresponding response
        response = self.response_lookup.get(predicted_intent, "I'm not sure how to respond to that.")
        
        return {
            "intent": predicted_intent,
            "confidence": float(prediction[0][predicted_class_idx]),
            "response": response
        }

    def save_model(self):
        self.model.save(self.model_path)
        with open(self.tokenizer_path, 'wb') as handle:
            pickle.dump(self.tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
        with open(self.label_encoder_path, 'wb') as handle:
            pickle.dump(
                {
                    "label_encoder": self.label_encoder,
                    "response_lookup": self.response_lookup
                },
                handle,
                protocol=pickle.HIGHEST_PROTOCOL
            )

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = load_model(self.model_path)
            with open(self.tokenizer_path, 'rb') as handle:
                self.tokenizer = pickle.load(handle)
            with open(self.label_encoder_path, 'rb') as handle:
                data = pickle.load(handle)
                self.label_encoder = data["label_encoder"]
                self.response_lookup = data["response_lookup"]
        else:
            raise FileNotFoundError("Model files not found. Please train the model first.")
