
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchBox from '@/components/weather/SearchBox';
import { toast } from "@/components/ui/use-toast";

const Maps = () => {
  const [city, setCity] = useState('');
  const [mapType, setMapType] = useState('temp_new');
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lon: 0 });
  const { currentUser } = useAuth();
  const OWM_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key

  useEffect(() => {
    // If user has a preferred city, update the map center
    if (currentUser?.preferredCity) {
      handleSearch(currentUser.preferredCity);
    }
  }, [currentUser]);

  const handleSearch = (searchCity) => {
    setCity(searchCity);
    // Ideally, you would geocode the city to get coordinates
    // For simplicity, we're just setting the city name for the map URL
    toast({
      title: "Map updated",
      description: `Showing weather map for ${searchCity}.`,
    });
  };

  const handleMapTypeChange = (value) => {
    setMapType(value);
  };

  // Map types and their labels
  const mapTypes = [
    { value: 'temp_new', label: 'Temperature' },
    { value: 'precipitation_new', label: 'Precipitation' },
    { value: 'wind_new', label: 'Wind Speed' },
    { value: 'pressure_new', label: 'Pressure' },
    { value: 'clouds_new', label: 'Clouds' }
  ];

  // Generate the OpenWeatherMap URL
  const getMapUrl = () => {
    let baseUrl = `https://tile.openweathermap.org/map/${mapType}`;
    
    // If a specific city is selected, we would normally center the map there
    // But for this demo, we'll use the map without specific coordinates
    // In a real app, you would geocode the city to get lat/lon
    
    return baseUrl;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="w-full mx-auto glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Weather Maps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <SearchBox onSearch={handleSearch} />
            </div>
            <div className="w-full md:w-64">
              <Select value={mapType} onValueChange={handleMapTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select map type" />
                </SelectTrigger>
                <SelectContent>
                  {mapTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center bg-black/20 rounded-lg p-4 mt-4">
            <div className="relative w-full aspect-video max-w-5xl">
              <iframe
                src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=${mapType}&lat=30&lon=0&zoom=3`}
                title="Weather Map"
                className="absolute inset-0 w-full h-full rounded-md border border-white/10"
                allowFullScreen
              />
            </div>
          </div>
          
          <div className="text-sm text-center mt-4 text-muted-foreground">
            <p>Weather map data provided by OpenWeatherMap</p>
            <p>This interactive map allows you to view different weather patterns globally.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full mx-auto glass-card">
        <CardHeader>
          <CardTitle>Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-card/30 rounded-lg">
              <h3 className="font-bold mb-2">Temperature</h3>
              <div className="flex items-center gap-2">
                <div className="h-4 w-full bg-gradient-to-r from-blue-600 via-green-500 to-red-600 rounded"></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>-40°C</span>
                <span>0°C</span>
                <span>40°C</span>
              </div>
            </div>
            
            <div className="p-4 bg-card/30 rounded-lg">
              <h3 className="font-bold mb-2">Precipitation</h3>
              <div className="flex items-center gap-2">
                <div className="h-4 w-full bg-gradient-to-r from-transparent via-blue-400 to-blue-800 rounded"></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0 mm</span>
                <span>10 mm</span>
                <span>20+ mm</span>
              </div>
            </div>
            
            <div className="p-4 bg-card/30 rounded-lg">
              <h3 className="font-bold mb-2">Wind Speed</h3>
              <div className="flex items-center gap-2">
                <div className="h-4 w-full bg-gradient-to-r from-green-300 via-yellow-400 to-red-600 rounded"></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0 m/s</span>
                <span>15 m/s</span>
                <span>30+ m/s</span>
              </div>
            </div>
            
            <div className="p-4 bg-card/30 rounded-lg">
              <h3 className="font-bold mb-2">Pressure</h3>
              <div className="flex items-center gap-2">
                <div className="h-4 w-full bg-gradient-to-r from-red-500 via-purple-400 to-blue-600 rounded"></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>950 hPa</span>
                <span>1000 hPa</span>
                <span>1050 hPa</span>
              </div>
            </div>
            
            <div className="p-4 bg-card/30 rounded-lg">
              <h3 className="font-bold mb-2">Clouds</h3>
              <div className="flex items-center gap-2">
                <div className="h-4 w-full bg-gradient-to-r from-blue-100 to-blue-900 rounded"></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maps;
