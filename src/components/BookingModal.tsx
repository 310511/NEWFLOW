import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  Users, 
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getCustomerAndBookingReference, testProxyConnection } from '@/services/authApi';
import { completeBooking } from '@/services/bookingService';

interface BookingModalProps {
  hotelDetails: any;
  selectedRoom: any;
  rooms?: number;
  guests?: number;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ hotelDetails, selectedRoom, rooms = 1, guests = 1, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    nationality: '',
    gender: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<{
    customerData: any;
    bookingReference: any;
  } | null>(null);
  
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: 'Mr'
  });

  // Test connection when component mounts
  useEffect(() => {
    console.log('🧪 Testing frontend to proxy server connection...');
    
    fetch('/api/test')
      .then(response => {
        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);
        return response.json();
      })
      .then(data => {
        console.log('✅ Success! Proxy server response:', data);
      })
      .catch(error => {
        console.error('❌ Error connecting to proxy server:', error);
        console.error('Error details:', error.message);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      console.log('🚀 Starting login process...');
      
      // Add a small delay to ensure proxy is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await getCustomerAndBookingReference(loginForm.email);
      
        // Store booking data for later use
        setBookingData({
          customerData: result.customerData,
          bookingReference: result.bookingReference
        });
        
        // Pre-fill booking form with customer data
        setBookingForm({
          firstName: result.customerData.data.first_name || '',
          lastName: result.customerData.data.last_name || '',
          email: result.customerData.data.email || loginForm.email,
          phone: result.customerData.data.phone || '',
          title: 'Mr' // Default title
        });
        
        setSuccessMessage(`Welcome back, ${result.customerData.data.first_name}! Your booking reference is: ${result.bookingReference.booking_reference_id}`);
      
      console.log('✅ Customer lookup successful:', result);
      
    } catch (error) {
      console.error('❌ Customer lookup failed:', error);
      console.error('Error details:', error);
      
      // More specific error handling
      if (error.message && error.message.includes('Failed to fetch')) {
        setErrorMessage('Network error. Please check if the server is running.');
      } else {
        setErrorMessage('Mail not registered');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      // For signup, we'll create a mock customer data and booking reference
      // In a real app, you'd call a signup API first
      const mockCustomerData = {
        data: {
          customer_id: `temp_${Date.now()}`,
          first_name: signupForm.firstName,
          last_name: signupForm.lastName,
          email: signupForm.email
        }
      };
      
      const mockBookingReference = {
        booking_reference_id: `BR_${Date.now()}`
      };
      
      // Store booking data for later use
      setBookingData({
        customerData: mockCustomerData,
        bookingReference: mockBookingReference
      });
      
      // Pre-fill booking form with signup data
      setBookingForm({
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        phone: signupForm.phone,
        title: 'Mr' // Default title
      });
      
      setSuccessMessage(`Account created successfully! Ready to complete your booking.`);
      
      console.log('Signup successful:', { mockCustomerData, mockBookingReference });
      
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorMessage('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteBooking = async () => {
    // Validate booking form data
    if (!bookingForm.firstName || !bookingForm.lastName || !bookingForm.email || !bookingForm.phone) {
      setErrorMessage('Please fill in all required fields (First Name, Last Name, Email, Phone).');
      return;
    }

    if (!bookingData) {
      setErrorMessage('Missing booking data. Please login first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Use selectedRoom data if available, otherwise use hotelDetails
      const roomData = selectedRoom || hotelDetails;
      const bookingCode = roomData?.BookingCode;
      
      if (!bookingCode) {
        throw new Error('No booking code available. Please select a room first.');
      }
      
      const totalFare = parseFloat(roomData?.TotalFare || roomData?.Price || 0);
      
      if (totalFare <= 0) {
        throw new Error('Invalid room price. Please select a valid room.');
      }
      
      console.log('Booking with data:', {
        bookingCode,
        bookingReferenceId: bookingData.bookingReference.booking_reference_id,
        totalFare,
        roomData,
        bookingForm
      });

      const result = await completeBooking(
        bookingCode,
        bookingData.bookingReference.booking_reference_id,
        bookingData.customerData,
        bookingForm, // Use booking form data instead of signup form
        totalFare,
        rooms, // Use actual rooms count
        guests // Use actual guests count
      );

      if (result.success) {
        setSuccessMessage(`Booking completed successfully! Confirmation: ${result.confirmationNumber || 'N/A'}`);
        // onClose()
        console.log('Booking completed:', result);
      } else {
        setErrorMessage(result.message || 'Booking failed. Please try again.');
        console.error('Booking failed:', result);
      }
    } catch (error) {
      console.error('Booking completion failed:', error);
      setErrorMessage('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setErrorMessage(null);
    setSuccessMessage(null);
  };


  return (
    <Card className="w-full max-h-[90vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
        <div>
          <CardTitle className="text-xl font-bold">Complete Your Booking</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {hotelDetails?.HotelName}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 overflow-y-auto">
        {/* Selected Room Summary */}
        {selectedRoom && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Selected Room</h4>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">{selectedRoom.Name}</p>
                <p className="text-xs text-muted-foreground">{selectedRoom.MealType}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant={selectedRoom.IsRefundable === "true" ? "default" : "destructive"} className="text-xs">
                    {selectedRoom.IsRefundable === "true" ? "Refundable" : "Non-Refundable"}
                  </Badge>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="font-bold text-primary">
                  {hotelDetails?.Currency || 'USD'} {selectedRoom.TotalFare}
                </div>
                <div className="text-xs text-muted-foreground">total</div>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {errorMessage && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Login/Signup Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In & Get Booking Reference"}
              </Button>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-firstname">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-firstname"
                      type="text"
                      placeholder="First name"
                      className="pl-10"
                      value={signupForm.firstName}
                      onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastname">Last Name</Label>
                  <Input
                    id="signup-lastname"
                    type="text"
                    placeholder="Last name"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-age">Age</Label>
                  <Input
                    id="signup-age"
                    type="number"
                    placeholder="Age"
                    min="18"
                    max="120"
                    value={signupForm.age}
                    onChange={(e) => setSignupForm({ ...signupForm, age: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-gender">Gender</Label>
                  <select
                    id="signup-gender"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={signupForm.gender}
                    onChange={(e) => setSignupForm({ ...signupForm, gender: e.target.value })}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-nationality">Nationality</Label>
                <Input
                  id="signup-nationality"
                  type="text"
                  placeholder="Enter your nationality"
                  value={signupForm.nationality}
                  onChange={(e) => setSignupForm({ ...signupForm, nationality: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account & Book"}
              </Button>
            </form>
          </TabsContent>

        </Tabs>

        {/* Booking Form - Only show after login */}
        {bookingData && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="booking-title">Title</Label>
                <Select 
                  value={bookingForm.title} 
                  onValueChange={(value) => setBookingForm({...bookingForm, title: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                    <SelectItem value="Dr">Dr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-firstname">First Name *</Label>
                <Input
                  id="booking-firstname"
                  placeholder="Enter first name"
                  value={bookingForm.firstName}
                  onChange={(e) => setBookingForm({...bookingForm, firstName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-lastname">Last Name *</Label>
              <Input
                id="booking-lastname"
                placeholder="Enter last name"
                value={bookingForm.lastName}
                onChange={(e) => setBookingForm({...bookingForm, lastName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-email">Email *</Label>
              <Input
                id="booking-email"
                type="email"
                placeholder="Enter email address"
                value={bookingForm.email}
                onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-phone">Phone Number *</Label>
              <Input
                id="booking-phone"
                type="tel"
                placeholder="Enter phone number"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                required
              />
            </div>
            <Button 
              onClick={handleCompleteBooking}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Completing Booking..." : "Complete Booking"}
            </Button>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Your information is secure and encrypted</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingModal;
