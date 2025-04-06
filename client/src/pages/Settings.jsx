
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Save, Trash2 } from "lucide-react";

const Settings = () => {
  const { currentUser, updateUserPreferences, logout } = useAuth();
  const navigate = useNavigate();
  
  // If not logged in, redirect to login
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  const [preferredCity, setPreferredCity] = useState(currentUser.preferredCity || '');
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [notifications, setNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUserPreferences(preferredCity);
      // Temperature unit and notifications would be saved here in a real app
      
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="w-full max-w-xl mx-auto glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={currentUser.email} 
                disabled 
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your account email cannot be changed
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="preferred-city">Preferred City</Label>
              <Input 
                id="preferred-city" 
                placeholder="e.g., New York" 
                value={preferredCity} 
                onChange={(e) => setPreferredCity(e.target.value)} 
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll show weather for this city when you log in
              </p>
            </div>
            
            <div className="space-y-3">
              <Label>Temperature Unit</Label>
              <RadioGroup 
                value={temperatureUnit} 
                onValueChange={setTemperatureUnit}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="celsius" id="celsius" />
                  <Label htmlFor="celsius">Celsius (°C)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                  <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="notifications" 
                checked={notifications} 
                onCheckedChange={setNotifications} 
              />
              <Label htmlFor="notifications">Enable weather alerts</Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Actions</h3>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
