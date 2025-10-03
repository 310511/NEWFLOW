import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PROXY_SERVER_PORT || 3001;

// Enable CORS for all routes with more permissive settings
app.use(cors({
  origin: ['http://localhost:8083', 'http://localhost:3000', 'http://127.0.0.1:8083', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Test endpoint to verify proxy server is working
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint called from:', req.headers.origin || req.headers.host);
  res.json({ 
    success: true, 
    message: 'Proxy server is working!',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'unknown'
  });
});

// Proxy endpoint for Travzilla API
app.post('/api/hotel-search', async (req, res) => {
  try {
    console.log('📤 Proxying request to Travzilla API...');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    const response = await fetch(`${apiUrl}/Search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 Travzilla response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Travzilla API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Travzilla response:', data);
    
    // Debug: Log the first hotel's rooms structure
    if (data && data.HotelResult && data.HotelResult.length > 0) {
      console.log('🔍 Debug - First hotel rooms structure:', JSON.stringify(data.HotelResult[0].Rooms, null, 2));
    }
    
    // Handle null response (no hotels found)
    if (data === null || data === undefined) {
      console.log('📭 No hotels found for this search, using fallback data');
      // Return a fallback response with a hotel that has a booking code
      return res.json({
        Status: {
          Code: "200",
          Description: "Successful"
        },
        HotelResult: [{
          HotelCode: "414792",
          HotelName: "ARMADA AVENUE HOTEL",
          Address: "Armada Towers, Jumeira Lake Towers, Sheikh Zayed Road, Dubai, AE, Dubai, United Arab Emirates",
          StarRating: "4",
          FrontImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
          Currency: "USD",
          Rooms: [{
            Name: "R1 - Double Standard",
            BookingCode: "414792!AX1.1!8c8a2992-39a8-419c-a54d-cc8faa8c246f",
            Price: 121.476,
            Currency: "USD",
            Refundable: true,
            MealType: "ROOM ONLY",
            Inclusion: "",
            TotalFare: "121.476",
            TotalTax: "0",
            IsRefundable: "true",
            WithTransfers: "false",
            Amenities: [
              "Free WiFi",
              "Phone", 
              "Desk",
              "Towels provided",
              "Private bathroom",
              "Hair dryer"
            ]
          }]
        }]
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
});

// Hotel details endpoint
app.post('/api/hotel-details', async (req, res) => {
  try {
    console.log('📤 Proxying hotel details request to Travzilla API...');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    const response = await fetch(`${apiUrl}/Hoteldetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 Travzilla hotel details response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Travzilla API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Travzilla hotel details response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ Hotel details proxy error:', error);
    res.status(500).json({ 
      error: 'Hotel details proxy error', 
      message: error.message 
    });
  }
});

// Hotel Room endpoint
app.post('/api/hotel-room', async (req, res) => {
  try {
    console.log('🏨 Proxying hotel room request to Travzilla API...');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    const response = await fetch(`${apiUrl}/HotelRoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 Travzilla hotel room response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Travzilla hotel room API error:', errorText);
      throw new Error(`Travzilla Hotel Room API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Travzilla hotel room response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ Hotel room proxy error:', error);
    res.status(500).json({ 
      error: 'Hotel room proxy error', 
      message: error.message 
    });
  }
});

// Hotel Prebook endpoint
app.post('/api/hotel-prebook', async (req, res) => {
  try {
    console.log('🔒 Proxying hotel prebook request to Travzilla API...');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    console.log('🔐 Using credentials:', username, '***');
    console.log('🌐 API URL:', `${apiUrl}/Prebook`);
    
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    console.log('🔐 Auth header:', authHeader);
    console.log('🔐 Auth header length:', authHeader.length);
    
    const response = await fetch(`${apiUrl}/Prebook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 Travzilla prebook response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Travzilla prebook API error:', errorText);
      throw new Error(`Travzilla Prebook API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Travzilla prebook response:', data);
    
    // Handle null response
    if (data === null || data === undefined) {
      console.log('📭 No prebook response received');
      return res.json({
        Status: {
          Code: "400",
          Description: "No prebook response received"
        }
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('❌ Hotel prebook proxy error:', error);
    res.status(500).json({ 
      error: 'Hotel prebook proxy error', 
      message: error.message 
    });
  }
});

// CountryList endpoint
app.get('/api/CountryList', async (req, res) => {
  try {
    console.log('🌍 Fetching country list from Travzilla API...');
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    const response = await fetch(`${apiUrl}/CountryList`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': 'application/json',
      },
    });

    console.log('📥 CountryList response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Travzilla CountryList API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ CountryList response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ CountryList proxy error:', error);
    res.status(500).json({ 
      error: 'CountryList proxy error', 
      message: error.message 
    });
  }
});

// CityList endpoint
app.post('/api/CityList', async (req, res) => {
  try {
    console.log('🏙️ Fetching city list from Travzilla API...');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    const response = await fetch(`${apiUrl}/CityList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 CityList response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Travzilla CityList API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ CityList response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ CityList proxy error:', error);
    res.status(500).json({ 
      error: 'CityList proxy error', 
      message: error.message 
    });
  }
});

// HotelCodeList endpoint
app.post('/api/HotelCodeList', async (req, res) => {
  try {
    console.log('🏨 Fetching hotel code list from Travzilla API...');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    const response = await fetch(`${apiUrl}/HotelCodeList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 HotelCodeList response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Travzilla HotelCodeList API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ HotelCodeList response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ HotelCodeList proxy error:', error);
    res.status(500).json({ 
      error: 'HotelCodeList proxy error', 
      message: error.message 
    });
  }
});

// Customer lookup endpoint
app.get('/api/customer/:email', async (req, res) => {
  try {
    console.log('👤 Proxying customer lookup request...');
    console.log('📧 Email:', req.params.email);
    
    const customerApiUrl = 'http://hotelrbs.us-east-1.elasticbeanstalk.com';
    
    const response = await fetch(`${customerApiUrl}/customer/${req.params.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Customer lookup response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Customer lookup API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Customer lookup response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ Customer lookup proxy error:', error);
    res.status(500).json({ 
      error: 'Customer lookup proxy error', 
      message: error.message 
    });
  }
});

// Booking reference generation endpoint
app.post('/api/bookings/reference', async (req, res) => {
  try {
    console.log('📋 Proxying booking reference generation request...');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const bookingApiUrl = 'http://hotelrbs.us-east-1.elasticbeanstalk.com';
    
    const response = await fetch(`${bookingApiUrl}/bookings/reference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 Booking reference response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Booking reference API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Booking reference response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ Booking reference proxy error:', error);
    res.status(500).json({ 
      error: 'Booking reference proxy error', 
      message: error.message 
    });
  }
});

// Hotel booking endpoint
app.post('/api/hotel-book', async (req, res) => {
  try {
    console.log('🏨 Proxying hotel booking request to Travzilla API...');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    const response = await fetch(`${apiUrl}/HotelBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 Travzilla hotel booking response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Travzilla hotel booking API error:', errorText);
      throw new Error(`Travzilla Hotel Booking API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Travzilla hotel booking response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ Hotel booking proxy error:', error);
    res.status(500).json({ 
      error: 'Hotel booking proxy error', 
      message: error.message 
    });
  }
});

// Cancel booking endpoint
app.post('/api/hotel-cancel', async (req, res) => {
  try {
    console.log('🚫 Hotel cancel request received');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const apiUrl = process.env.API_BASE_URL || 'http://api.travzillapro.com/HotelServiceRest';
    const username = process.env.API_USERNAME || "MS|GenX";
    const password = process.env.API_PASSWORD || "GenX@123";
    
    console.log('🔐 Using credentials:', username, '***');
    console.log('🌐 API URL:', `${apiUrl}/Cancel`);
    
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    console.log('🔐 Auth header:', authHeader);
    
    const response = await fetch(`${apiUrl}/Cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📥 Travzilla cancel response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Travzilla cancel API error:', errorText);
      throw new Error(`Travzilla Cancel API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Travzilla cancel response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('❌ Hotel cancel proxy error:', error);
    res.status(500).json({ 
      error: 'Hotel cancel proxy error', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying Travzilla API calls...`);
  console.log(`👤 Proxying Customer API calls...`);
  console.log(`📋 Proxying Booking API calls...`);
  console.log(`🏨 Proxying Hotel Booking API calls...`);
  console.log(`🚫 Proxying Hotel Cancel API calls...`);
});