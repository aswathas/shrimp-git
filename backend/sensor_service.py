import serial
import threading
import time
import atexit

# Store latest sensor readings
latest_sensor_data = {"pH": None, "TDS": None, "Temperature": None}

# Try to initialize serial connection
try:
    ser = serial.Serial('COM18', 115200, timeout=1)
    # Gracefully close serial on exit
    atexit.register(lambda: ser.close())
except Exception as e:
    print(f"Warning: Could not open serial port: {e}")
    ser = None

# Function to continuously read from serial
def read_serial_data():
    global latest_sensor_data
    if ser is None:
        return
        
    while True:
        try:
            line = ser.readline().decode().strip()
            if line:
                try:
                    pH, TDS, temp = map(float, line.split(","))
                    latest_sensor_data = {"pH": pH, "TDS": TDS, "Temperature": temp}
                except ValueError:
                    print("Invalid data received:", line)
        except Exception as e:
            print(f"Error reading serial data: {e}")
        time.sleep(1)

# Start serial reading thread
if ser is not None:
    threading.Thread(target=read_serial_data, daemon=True).start()

def get_sensor_data():
    """
    Get IoT sensor data - use real data if available, otherwise fallback to mock data
    """
    if latest_sensor_data["pH"] is not None:
        return {
            "pH": latest_sensor_data["pH"],
            "tds": latest_sensor_data["TDS"],
            "temperature": latest_sensor_data["Temperature"],
        }
    else:
        # Fallback mock data
        return {
            "pH": 8.1,
            "tds": 1200,
            "temperature": 28.5,
        }