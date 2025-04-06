
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getForecastByCity, 
  getForecastByCoords,
  getWeatherIconUrl,
  formatTime,
  getUserLocation 
} from '@/services/weatherService';
import SearchBox from '@/components/weather/SearchBox';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';

const Hourly = () => {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState('');
  const [isUsingGeolocation, setIsUsingGeolocation] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadInitialForecast = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser?.preferredCity) {
          await fetchForecastByCity(currentUser.preferredCity);
        } else {
          await fetchForecastByGeolocation();
        }
      } catch (error) {
        console.error('Error loading initial forecast:', error);
        toast({
          variant: "destructive",
          title: "Failed to load forecast",
          description: error.message || "Please try searching for a city instead.",
        });
        
        await fetchForecastByCity('London');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialForecast();
  }, [currentUser]);

  const fetchForecastByCity = async (city) => {
    setIsLoading(true);
    setIsUsingGeolocation(false);
    try {
      const forecastData = await getForecastByCity(city);
      
      setForecast(forecastData);
      setCurrentCity(city);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "City not found",
        description: "Please check the city name and try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecastByGeolocation = async () => {
    setIsLoading(true);
    setIsUsingGeolocation(true);
    try {
      const { lat, lon } = await getUserLocation();
      
      const forecastData = await getForecastByCoords(lat, lon);
      
      setForecast(forecastData);
      setCurrentCity(forecastData.city.name);
      
      toast({
        title: "Location detected",
        description: `Showing forecast for ${forecastData.city.name}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Location error",
        description: error.message || "Could not detect your location.",
      });
      throw error;
    } finally {
      setIsLoading(false);
      setIsUsingGeolocation(false);
    }
  };

  const handleSearch = (city) => {
    fetchForecastByCity(city);
  };

  // Get forecast for the next 24 hours (8 entries)
  const hourlyForecast = forecast ? forecast.list.slice(0, 8) : [];

  // Prepare data for the chart
  const chartData = hourlyForecast.map(hour => ({
    time: formatTime(hour.dt),
    temp: Math.round(hour.main.temp),
    feels_like: Math.round(hour.main.feels_like),
    hour: new Date(hour.dt * 1000).getHours(),
    weatherIcon: hour.weather[0].icon,
    description: hour.weather[0].description
  }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <SearchBox onSearch={handleSearch} />
        <Button 
          variant="outline" 
          className="shrink-0 w-full md:w-auto"
          onClick={fetchForecastByGeolocation}
          disabled={isUsingGeolocation}
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isUsingGeolocation ? 'Getting location...' : 'Use my location'}
        </Button>
      </div>
      
      <section>
        <Card className="w-full mx-auto glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isLoading ? 'Loading hourly forecast...' : 
                forecast ? `Hourly Forecast for ${forecast.city.name}, ${forecast.city.country}` : 
                'Enter a city to see hourly forecast'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card/30 rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-muted rounded w-24 mb-4"></div>
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-12 w-12 bg-muted rounded-full"></div>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="h-8 bg-muted rounded w-20 mx-auto"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hourlyForecast.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {hourlyForecast.map((hour, index) => (
                  <div key={index} className="bg-card/30 rounded-lg p-4 hover:bg-card/50 transition-colors text-center">
                    <h3 className="font-bold text-lg mb-2">{formatTime(hour.dt)}</h3>
                    <div className="flex justify-center mb-4">
                      <img 
                        src={getWeatherIconUrl(hour.weather[0].icon)} 
                        alt={hour.weather[0].description} 
                        className="w-16 h-16"
                      />
                    </div>
                    <p className="text-2xl font-bold mb-1">{Math.round(hour.main.temp)}°C</p>
                    <p className="capitalize mb-2">{hour.weather[0].description}</p>
                    <div className="text-sm opacity-80">
                      <p>Feels like: {Math.round(hour.main.feels_like)}°C</p>
                      <p>Humidity: {hour.main.humidity}%</p>
                      <p>Wind: {Math.round(hour.wind.speed)} m/s</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8">No hourly forecast data available. Please search for a city.</p>
            )}
          </CardContent>
        </Card>
      </section>
      
      {forecast && (
        <section>
          <Card className="w-full mx-auto glass-card overflow-hidden">
            <CardHeader>
              <CardTitle>Hourly Temperature Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {hourlyForecast.length > 0 && (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fill: 'currentColor', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                        tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'currentColor', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                        tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                        domain={['dataMin - 2', 'dataMax + 2']}
                        unit="°C"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                        formatter={(value) => [`${value}°C`]}
                      />
                      <ReferenceLine 
                        y={0} 
                        stroke="rgba(255, 255, 255, 0.5)" 
                        strokeDasharray="3 3" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="temp" 
                        name="Temperature" 
                        stroke="#7c3aed" 
                        strokeWidth={3}
                        dot={{ r: 6, strokeWidth: 2, fill: '#1e293b' }}
                        activeDot={{ r: 8, strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="feels_like" 
                        name="Feels Like" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

export default Hourly;
