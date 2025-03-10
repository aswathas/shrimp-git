import { useState, useEffect } from 'react';
import { SensorData } from '@/lib/types';

export function useSensorData(interval = 5000) {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/monitoring');
        if (!response.ok) throw new Error('Failed to fetch sensor data');
        const newData = await response.json();
        setData(newData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling interval
    const pollInterval = setInterval(fetchData, interval);

    return () => clearInterval(pollInterval);
  }, [interval]);

  return { data, error, loading };
}