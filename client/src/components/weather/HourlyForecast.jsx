
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherIconUrl, formatTime } from '@/services/weatherService';
import { ScrollArea } from "@/components/ui/scroll-area";

const HourlyForecast = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto glass-card">
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-40 rounded"></CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex space-x-4 overflow-x-auto">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse min-w-[80px]">
                <div className="h-5 w-16 bg-muted rounded mb-2"></div>
                <div className="h-10 w-10 bg-muted rounded-full mb-2"></div>
                <div className="h-6 w-12 bg-muted rounded"></div>
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

  // Get next 24 hours (8 entries, as each is 3 hours apart)
  const hourlyData = data.list.slice(0, 8);

  return (
    <Card className="w-full max-w-xl mx-auto glass-card">
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-6">
            {hourlyData.map((hour, index) => (
              <div key={index} className="flex flex-col items-center min-w-[80px] p-2 hover:bg-black/10 rounded-lg transition-colors">
                <p className="font-medium">{formatTime(hour.dt)}</p>
                <img 
                  src={getWeatherIconUrl(hour.weather[0].icon)} 
                  alt={hour.weather[0].description} 
                  className="w-12 h-12 my-2"
                />
                <p className="text-lg font-bold">{Math.round(hour.main.temp)}°C</p>
                <p className="text-xs capitalize text-center">{hour.weather[0].description}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;
