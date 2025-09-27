# Dynamic Hotel Code Fetching Implementation

## Overview

This implementation replaces the hardcoded hotel codes in the search functionality with a dynamic system that fetches hotel codes based on country and city selection using the Travzilla API.

## API Flow

The dynamic hotel code fetching follows this flow:

1. **GET CountryList** → Get list of countries with codes
2. **POST CityList** → Use country code to get cities for that country  
3. **POST GenXHotelCodeList** → Use country + city codes to get hotel codes

## Files Added/Modified

### New Files

1. **`src/services/hotelCodeApi.ts`**
   - API service functions for the three endpoints
   - TypeScript interfaces for API responses
   - Helper functions for finding codes by names

2. **`src/hooks/useDynamicHotelCodes.ts`**
   - React hook for managing the dynamic hotel code flow
   - State management for countries, cities, hotels
   - Loading states and error handling
   - Helper function to fetch by country/city names

3. **`src/components/HotelCodeTester.tsx`**
   - Test component to demonstrate the functionality
   - Interactive UI to test the complete flow
   - Available at `/test-hotel-codes` route

### Modified Files

1. **`proxy-server.js`**
   - Added three new proxy endpoints:
     - `GET /api/country-list`
     - `POST /api/city-list` 
     - `POST /api/hotel-code-list`

2. **`src/pages/SearchResults.tsx`**
   - Integrated dynamic hotel code fetching
   - Replaced hardcoded hotel codes with dynamic fetching
   - Added loading states for hotel code fetching
   - Fallback to hardcoded codes if dynamic fetching fails

3. **`src/App.tsx`**
   - Added route for hotel code tester component

## How It Works

### In SearchResults Component

1. When a user searches for hotels, the component:
   - Maps the destination to country/city names
   - Calls `fetchHotelsByNames()` to get hotel codes dynamically
   - Uses the fetched hotel codes in the search API call
   - Falls back to hardcoded codes if dynamic fetching fails

### Destination Mapping

The system maps common destinations to their country/city names:

```typescript
const destinationMap = {
  'dubai': { country: 'United Arab Emirates', city: 'Dubai' },
  'abu dhabi': { country: 'United Arab Emirates', city: 'Abu Dhabi' },
  'riyadh': { country: 'Saudi Arabia', city: 'Riyadh' },
  'doha': { country: 'Qatar', city: 'Doha' },
  // ... more destinations
};
```

### API Integration

All API calls go through the proxy server to handle:
- CORS issues
- Authentication headers
- Error handling
- Response processing

## Testing

### Manual Testing

1. Start the proxy server: `node proxy-server.js`
2. Start the frontend: `npm run dev`
3. Visit `/test-hotel-codes` to test the dynamic flow
4. Or search for hotels normally - the system will automatically fetch hotel codes

### API Testing

You can test the APIs directly:

```bash
# Get countries
curl http://localhost:3001/api/country-list

# Get cities for UAE
curl -X POST http://localhost:3001/api/city-list \
  -H "Content-Type: application/json" \
  -d '{"CountryCode": "AE"}'

# Get hotels for Dubai
curl -X POST http://localhost:3001/api/hotel-code-list \
  -H "Content-Type: application/json" \
  -d '{"CountryCode": "AE", "CityCode": "GE2378460", "IsDetailedResponse": "false"}'
```

## Benefits

1. **Dynamic**: No more hardcoded hotel codes
2. **Scalable**: Works for any country/city combination
3. **Real-time**: Always gets the latest hotel data
4. **Fallback**: Graceful degradation if dynamic fetching fails
5. **User-friendly**: Better loading states and error handling

## Error Handling

- Network errors are caught and logged
- Fallback to hardcoded codes if dynamic fetching fails
- User-friendly error messages
- Loading states for better UX

## Future Enhancements

1. **Caching**: Cache country/city/hotel data to reduce API calls
2. **Search by Name**: Allow users to search by hotel name
3. **Filters**: Add filters for star rating, amenities, etc.
4. **Pagination**: Handle large hotel lists with pagination
5. **Offline Support**: Cache data for offline usage
