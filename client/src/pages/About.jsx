
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Cloud, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Map, 
  Clock, 
  Info
} from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="w-full mx-auto glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About WeatherApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">
            WeatherApp provides real-time weather information and forecasts for locations around the world. 
            Our mission is to deliver accurate, timely, and easy-to-understand weather data to help you plan your day.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
              <Cloud className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Accurate Forecasts</h3>
              <p>Using advanced meteorological data to provide the most accurate weather predictions possible.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
              <Map className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
              <p>Access weather data for virtually any location worldwide with our comprehensive coverage.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
              <Clock className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
              <p>Stay informed with real-time weather updates and alerts for your location.</p>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
            <p className="mb-4">
              WeatherApp uses data from the OpenWeatherMap API, which collects and processes 
              weather data from various meteorological services and stations worldwide.
            </p>
            <p>
              For more information about our data providers, visit{' '}
              <a 
                href="https://openweathermap.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenWeatherMap
              </a>.
            </p>
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h2 className="text-2xl font-bold mb-4">How to Use WeatherApp</h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>
                <span className="font-medium">Search for a location:</span> Enter a city name in the search bar to get current weather and forecasts.
              </li>
              <li>
                <span className="font-medium">Use your current location:</span> Click the "Use my location" button to automatically detect your position.
              </li>
              <li>
                <span className="font-medium">Create an account:</span> Sign up to save your preferred locations and customize your experience.
              </li>
              <li>
                <span className="font-medium">Explore different views:</span> Check the current weather, hourly forecasts, 7-day predictions, and weather maps.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full mx-auto glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-card/30 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">How accurate are the weather forecasts?</h3>
              <p>
                Our forecasts are sourced from OpenWeatherMap, which aggregates data from multiple meteorological services. 
                While we strive for the highest accuracy, weather predictions can be affected by various factors and may vary in accuracy.
              </p>
            </div>
            
            <div className="bg-card/30 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">How often is the weather data updated?</h3>
              <p>
                Current weather data is updated approximately every 10 minutes. Forecast data is typically updated every 3 hours.
              </p>
            </div>
            
            <div className="bg-card/30 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Can I view weather for any location in the world?</h3>
              <p>
                Yes, our service provides weather information for virtually any location worldwide. Simply enter the city name in the search bar.
              </p>
            </div>
            
            <div className="bg-card/30 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Is the geolocation feature accurate?</h3>
              <p>
                The accuracy of geolocation depends on your device and browser settings. For best results, ensure you have granted location permissions to the website.
              </p>
            </div>
            
            <div className="bg-card/30 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">How do I switch between Celsius and Fahrenheit?</h3>
              <p>
                You can change your temperature unit preference in the Settings page after creating an account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full mx-auto glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Have questions, feedback, or need assistance? We'd love to hear from you! Please use one of the following methods to get in touch with our team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/30 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Email Support</h3>
              <p className="mb-2">For general inquiries and support:</p>
              <a href="mailto:support@weatherapp.example" className="text-primary hover:underline">
                support@weatherapp.example
              </a>
            </div>
            
            <div className="bg-card/30 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <p className="mb-2">Follow us on social media for updates and tips:</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-primary hover:text-primary/80">Twitter</a>
                <a href="#" className="text-primary hover:text-primary/80">Facebook</a>
                <a href="#" className="text-primary hover:text-primary/80">Instagram</a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
