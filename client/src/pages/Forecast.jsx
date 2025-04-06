
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getForecastByCity, 
  getForecastByCoords, 
  getWeatherIconUrl, 
  formatDate, 
  getUserLocation 
} from '@/services/weatherService';
import SearchBox from '@/components/weather/SearchBox';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const Forecast = () => {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState('');
  const [isUsingGeolocation, setIsUsingGeolocation] = useState(false);
  const { currentUser } = useAuth();

  // Load forecast based on user preferences or geolocation
  useEffect(() => {
    const loadInitialForecast = async () => {
      setIsLoading(true);
      
      try {
        // If user is logged in and has a preferred city
        if (currentUser?.preferredCity) {
          await fetchForecastByCity(currentUser.preferredCity);
        } else {
          // Try to get user's location
          await fetchForecastByGeolocation();
        }
      } catch (error) {
        console.error('Error loading initial forecast:', error);
        toast({
          variant: "destructive",
          title: "Failed to load forecast",
          description: error.message || "Please try searching for a city instead.",
        });
        
        // Fallback to a default city
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

  // Process forecast data to get one entry per day
  const processForecastData = () => {
    if (!forecast || !forecast.list) return [];
    
    const dailyData = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: item.dt,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          humidity: item.main.humidity,
          wind: item.wind.speed,
          clouds: item.clouds.all,
          weather_id: item.weather[0].id
        };
      } else {
        // Update max/min temperatures if needed
        if (item.main.temp_max > dailyData[date].temp_max) {
          dailyData[date].temp_max = item.main.temp_max;
        }
        if (item.main.temp_min < dailyData[date].temp_min) {
          dailyData[date].temp_min = item.main.temp_min;
        }
      }
    });
    
    return Object.values(dailyData).slice(0, 7); // Get 7 days
  };

  const dailyForecast = processForecastData();

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
              {isLoading ? 'Loading forecast...' : 
                forecast ? `7-Day Forecast for ${forecast.city.name}, ${forecast.city.country}` : 
                'Enter a city to see forecast'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="bg-card/30 rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-muted rounded w-24 mb-4"></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-muted rounded-full"></div>
                      <div className="h-8 bg-muted rounded w-20"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : dailyForecast.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dailyForecast.map((day, index) => (
                  <div key={index} className="bg-card/30 rounded-lg p-4 hover:bg-card/50 transition-colors">
                    <h3 className="font-bold text-lg mb-2">{formatDate(day.date)}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <img 
                        src={getWeatherIconUrl(day.icon)} 
                        alt={day.description} 
                        className="w-16 h-16"
                      />
                      <div className="text-right">
                        <p className="text-2xl font-bold">{Math.round(day.temp_max)}°</p>
                        <p className="text-lg opacity-80">{Math.round(day.temp_min)}°</p>
                      </div>
                    </div>
                    <p className="capitalize mb-2">{day.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm opacity-80">
                      <p>Humidity: {day.humidity}%</p>
                      <p>Wind: {Math.round(day.wind)} m/s</p>
                      <p>Clouds: {day.clouds}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8">No forecast data available. Please search for a city.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Forecast;
