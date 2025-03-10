export interface SensorData {
  timestamp: string;
  sensors: {
    ph: number;
    ammonia: number;
    salinity: number;
    oxygen: number;
  };
  status: string;
}

export interface MetricConfig {
  name: string;
  value: number;
  type: string;
  unit?: string;
  icon: any;
  ranges: {
    min: number;
    max: number;
    warningThreshold: number;
  };
}