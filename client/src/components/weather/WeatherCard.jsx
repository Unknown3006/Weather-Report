import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { getWeatherIconUrl, formatDate, getWeatherBackground } from '@/services/weatherService';
import { useWeather } from '@/contexts/WeatherContext';

const WeatherCard = ({ data, isLoading }) => {
  const { formatTemperature } = useWeather();

  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto glass-card animate-pulse">
        <CardContent className="p-6">
          <div className="h-20 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const weatherClass = getWeatherBackground(data.weather[0].id);

  return (
    <Card className={`w-full max-w-xl mx-auto overflow-hidden ${weatherClass}`}>
      <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-3xl font-bold">{data.name}, {data.sys.country}</h2>
          <p className="text-lg opacity-90">{formatDate(data.dt)}</p>
          <div className="flex items-center mt-2">
            <img 
              src={getWeatherIconUrl(data.weather[0].icon)} 
              alt={data.weather[0].description} 
              className="w-20 h-20"
            />
            <div className="ml-2">
              <h3 className="text-5xl font-bold">{formatTemperature(data.main.temp)}</h3>
              <p className="text-lg capitalize">{data.weather[0].description}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0 md:ml-auto">
          <div className="text-center">
            <p className="text-sm opacity-80">Feels Like</p>
            <p className="text-xl font-medium">{formatTemperature(data.main.feels_like)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80">Humidity</p>
            <p className="text-xl font-medium">{data.main.humidity}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80">Wind</p>
            <p className="text-xl font-medium">{Math.round(data.wind.speed)} m/s</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80">Pressure</p>
            <p className="text-xl font-medium">{data.main.pressure} hPa</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
