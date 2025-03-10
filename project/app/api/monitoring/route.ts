import { NextResponse } from 'next/server';

// Simulated IoT sensor data - In production, this would connect to actual IoT devices
const generateSensorData = () => {
  return {
    timestamp: new Date().toISOString(),
    sensors: {
      ph: 7.2 + (Math.random() * 0.4 - 0.2),
      ammonia: 0.4 + (Math.random() * 0.2 - 0.1),
      salinity: 15 + (Math.random() * 2 - 1),
      oxygen: 6.8 + (Math.random() * 0.6 - 0.3),
    },
    status: "operational",
  };
};

export async function GET() {
  try {
    const data = generateSensorData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sensor data" },
      { status: 500 }
    );
  }
}