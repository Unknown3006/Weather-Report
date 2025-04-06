
// OpenWeatherMap API key
// Replace this with your actual API key from https://openweathermap.org/api
const API_KEY = '4d8fb5b93d4af21d66a2948710284366'; // Free tier API key for demo purposes
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper to handle fetch errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch weather data');
  }
  return response.json();
};

// Get current weather by city name
export const getCurrentWeatherByCity = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// Get current weather by coordinates
export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// Get 5-day forecast by city name
export const getForecastByCity = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

// Get 5-day forecast by coordinates
export const getForecastByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Get user's current location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    }
  });
};

// Convert Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

// Format date
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Get day or night indicator based on sunrise/sunset
export const isDayTime = (timestamp, sunrise, sunset) => {
  const current = new Date(timestamp * 1000).getTime();
  const sunriseTime = new Date(sunrise * 1000).getTime();
  const sunsetTime = new Date(sunset * 1000).getTime();
  return current > sunriseTime && current < sunsetTime;
};

// Map weather condition to background class
export const getWeatherBackground = (weatherCode) => {
  // Map OpenWeatherMap condition codes to our custom backgrounds
  const weatherId = parseInt(weatherCode);
  
  if (weatherId >= 200 && weatherId < 300) {
    return 'weather-gradient-thunderstorm'; // Thunderstorm
  } else if (weatherId >= 300 && weatherId < 400) {
    return 'weather-gradient-rain'; // Drizzle
  } else if (weatherId >= 500 && weatherId < 600) {
    return 'weather-gradient-rain'; // Rain
  } else if (weatherId >= 600 && weatherId < 700) {
    return 'weather-gradient-snow'; // Snow
  } else if (weatherId >= 700 && weatherId < 800) {
    return 'weather-gradient-mist'; // Atmosphere (fog, mist)
  } else if (weatherId === 800) {
    return 'weather-gradient-clear'; // Clear sky
  } else if (weatherId > 800) {
    return 'weather-gradient-cloudy'; // Clouds
  }
  
  return 'weather-gradient-cloudy'; // Default
};
