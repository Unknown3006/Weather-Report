
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCurrentWeatherByCity, 
  getCurrentWeatherByCoords, 
  getForecastByCity, 
  getForecastByCoords, 
  getUserLocation 
} from '@/services/weatherService';
import WeatherCard from '@/components/weather/WeatherCard';
import ForecastCard from '@/components/weather/ForecastCard';
import HourlyForecast from '@/components/weather/HourlyForecast';
import SearchBox from '@/components/weather/SearchBox';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState('');
  const [isUsingGeolocation, setIsUsingGeolocation] = useState(false);
  const { currentUser } = useAuth();

  // Load weather based on user preferences or geolocation
  useEffect(() => {
    const loadInitialWeather = async () => {
      setIsLoading(true);
      
      try {
        // If user is logged in and has a preferred city
        if (currentUser?.preferredCity) {
          await fetchWeatherByCity(currentUser.preferredCity);
        } else {
          // Try to get user's location
          await fetchWeatherByGeolocation();
        }
      } catch (error) {
        console.error('Error loading initial weather:', error);
        toast({
          variant: "destructive",
          title: "Failed to load weather",
          description: error.message || "Please try searching for a city instead.",
        });
        
        // Fallback to a default city
        await fetchWeatherByCity('London');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialWeather();
  }, [currentUser]);

  const fetchWeatherByCity = async (city) => {
    setIsLoading(true);
    setIsUsingGeolocation(false);
    try {
      const weatherData = await getCurrentWeatherByCity(city);
      const forecastData = await getForecastByCity(city);
      
      setWeather(weatherData);
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

  const fetchWeatherByGeolocation = async () => {
    setIsLoading(true);
    setIsUsingGeolocation(true);
    try {
      const { lat, lon } = await getUserLocation();
      
      const weatherData = await getCurrentWeatherByCoords(lat, lon);
      const forecastData = await getForecastByCoords(lat, lon);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setCurrentCity(weatherData.name);
      
      toast({
        title: "Location detected",
        description: `Showing weather for ${weatherData.name}.`,
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
    fetchWeatherByCity(city);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <SearchBox onSearch={handleSearch} />
        <Button 
          variant="outline" 
          className="shrink-0 w-full md:w-auto"
          onClick={fetchWeatherByGeolocation}
          disabled={isUsingGeolocation}
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isUsingGeolocation ? 'Getting location...' : 'Use my location'}
        </Button>
      </div>
      
      <section>
        <WeatherCard data={weather} isLoading={isLoading} />
      </section>
      
      <section>
        <HourlyForecast data={forecast} isLoading={isLoading} />
      </section>
      
      <section>
        <ForecastCard data={forecast} isLoading={isLoading} />
      </section>
      
      {!currentUser && (
        <div className="mt-8 p-6 bg-primary/10 rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">Create an account for personalized weather</h3>
          <p className="mb-4">Save your preferred city and get weather updates automatically.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = '/signup'}>Sign Up</Button>
            <Button variant="outline" onClick={() => window.location.href = '/login'}>Login</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
