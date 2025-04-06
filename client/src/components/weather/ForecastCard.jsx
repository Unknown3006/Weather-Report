
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherIconUrl, formatDate } from '@/services/weatherService';

const ForecastCard = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto glass-card">
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-40 rounded"></CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="h-5 w-20 bg-muted rounded mb-2"></div>
                <div className="h-10 w-10 bg-muted rounded-full mb-2"></div>
                <div className="h-6 w-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.list) {
    return null;
  }

  // Process forecast data to get one entry per day
  const dailyForecast = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {});

  // Convert to array and get the next 5 days
  const forecastDays = Object.values(dailyForecast).slice(0, 5);

  return (
    <Card className="w-full max-w-xl mx-auto glass-card">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecastDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center p-2 hover:bg-black/10 rounded-lg transition-colors">
              <p className="font-medium">{formatDate(day.dt)}</p>
              <img 
                src={getWeatherIconUrl(day.weather[0].icon)} 
                alt={day.weather[0].description} 
                className="w-14 h-14 my-2"
              />
              <p className="text-lg font-bold">{Math.round(day.main.temp)}°C</p>
              <p className="text-sm capitalize text-center">{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
