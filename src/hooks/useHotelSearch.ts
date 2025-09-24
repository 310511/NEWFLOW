import { useState, useCallback } from 'react';
import { searchHotels, HotelSearchParams, HotelResult } from '../services/hotelApi';

export const useHotelSearch = () => {
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: HotelSearchParams) => {
    console.log('🚀 Starting hotel search with params:', params);
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchHotels(params);
      console.log('📊 Received API response:', response);
      
      if (response.Status.Code === '200') {
        console.log('✅ Success! Found hotels:', response.HotelResult?.length || 0);
        setHotels(response.HotelResult || []);
      } else if (response.Status.Code === '201') {
        console.log('⚠️ No rooms available');
        setError('No available rooms found for your search criteria. Try different dates or destinations.');
        setHotels([]);
      } else {
        console.log('❌ API error:', response.Status.Description);
        setError(response.Status.Description || 'Search failed');
        setHotels([]);
      }
    } catch (err) {
      console.error('💥 Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setHotels([]);
    setError(null);
  }, []);

  return {
    hotels,
    loading,
    error,
    search,
    clearResults,
  };
};
