import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { celsiusToFahrenheit } from '@/services/weatherService';

const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const formatTemperature = (celsius) => {
    const unit = currentUser?.settings?.temperatureUnit || 'celsius';
    const temp = unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
    return `${Math.round(temp)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
  };

  const value = {
    formatTemperature,
    temperatureUnit: currentUser?.settings?.temperatureUnit || 'celsius'
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);