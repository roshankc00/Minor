from insert_data import main as insert_data
from model import HealthAssistantModel
import time

def setup():
    print("Step 1: Inserting health data into MongoDB...")
    insert_data()
    
    print("\nStep 2: Initializing the health assistant model...")
    model = HealthAssistantModel()
    
    print("\nStep 3: Training the model...")
    history, model_info = model.train()
    
    print("\nTraining completed!")
    print(f"Model accuracy: {model_info['accuracy']:.2%}")
    print(f"Model loss: {model_info['loss']:.4f}")
    
    print("\nSetup complete! You can now run 'main.py' to start the API server.")

if __name__ == "__main__":
    setup()
