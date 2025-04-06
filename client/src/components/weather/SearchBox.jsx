
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SearchBox = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      toast({
        variant: "destructive",
        title: "Please enter a city name",
        description: "City name cannot be empty",
      });
      return;
    }
    
    setIsSearching(true);
    try {
      await onSearch(city.trim());
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" className="shrink-0" disabled={isSearching}>
          <SearchIcon className="h-4 w-4 mr-2" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </form>
  );
};

export default SearchBox;
