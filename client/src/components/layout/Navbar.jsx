
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Moon, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Update HTML class for dark mode
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold">
            WeatherApp
          </NavLink>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "font-medium text-primary" : "text-foreground hover:text-primary"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/forecast" 
              className={({ isActive }) => 
                isActive ? "font-medium text-primary" : "text-foreground hover:text-primary"
              }
            >
              Forecast
            </NavLink>
            <NavLink 
              to="/hourly" 
              className={({ isActive }) => 
                isActive ? "font-medium text-primary" : "text-foreground hover:text-primary"
              }
            >
              Hourly
            </NavLink>
            <NavLink 
              to="/maps" 
              className={({ isActive }) => 
                isActive ? "font-medium text-primary" : "text-foreground hover:text-primary"
              }
            >
              Maps
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive ? "font-medium text-primary" : "text-foreground hover:text-primary"
              }
            >
              About
            </NavLink>
            {currentUser ? (
              <>
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => 
                    isActive ? "font-medium text-primary" : "text-foreground hover:text-primary"
                  }
                >
                  Settings
                </NavLink>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/login')}>Login</Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2 animate-fade-in">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded ${isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/forecast" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded ${isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Forecast
            </NavLink>
            <NavLink 
              to="/hourly" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded ${isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Hourly
            </NavLink>
            <NavLink 
              to="/maps" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded ${isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Maps
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded ${isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            {currentUser ? (
              <>
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded ${isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </NavLink>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                className="w-full justify-start" 
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
              >
                Login
              </Button>
            )}
            <div className="pt-2 flex justify-between items-center px-4">
              <span className="text-sm">Toggle theme</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
