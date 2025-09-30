// Hotel booking service for final booking API call

const BOOKING_API_URL = '/api/hotel-book'; // Use proxy server

export interface CustomerName {
  Title: string;
  FirstName: string;
  LastName: string;
  Type: 'Adult' | 'Child';
}

export interface CustomerDetails {
  CustomerNames: CustomerName[];
}

export interface BookingRequest {
  BookingCode: string;
  CustomerDetails: CustomerDetails[];
  BookingType: 'Confirm' | 'Voucher';
  ClientReferenceId: string;
  BookingReferenceId: string;
  PaymentMode: 'Limit' | 'Credit';
  GuestNationality: string;
  TotalFare: number;
  EmailId: string;
  PhoneNumber: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
  confirmationNumber?: string;
  data?: any;
}

// Create customer details from booking form data
export const createCustomerDetails = (bookingForm: any, rooms: number = 1, guests: number = 1): CustomerDetails[] => {
  const customerDetails: CustomerDetails[] = [];
  
  // Create one customer detail per room
  for (let i = 0; i < rooms; i++) {
    const customerNames = [];
    
    // Add primary guest (adult)
    customerNames.push({
      Title: bookingForm.title || "Mr",
      FirstName: bookingForm.firstName,
      LastName: bookingForm.lastName,
      Type: "Adult"
    });
    
    // Add additional guests if more than 1
    for (let j = 1; j < guests; j++) {
      customerNames.push({
        Title: "Mr", // Default for additional guests
        FirstName: `Guest${j + 1}`,
        LastName: bookingForm.lastName,
        Type: j === 1 ? "Adult" : "Child" // First additional guest is adult, rest are children
      });
    }
    
    customerDetails.push({
      CustomerNames: customerNames
    });
  }
  
  return customerDetails;
};

// Generate client reference ID (timestamp-based with random suffix)
export const generateClientReferenceId = (): string => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}#${randomSuffix}`;
};

// Make the final booking API call
export const makeBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  try {
    const response = await fetch(BOOKING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers here
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`Booking failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check if the API returned an error status
    // Check for API errors
    if (data.Status && data.Status.Code !== '200' && data.Status.Code !== '201') {
      return {
        success: false,
        message: data.Status.Description || 'Booking failed',
        data: data
      };
    }
    
    // Check if booking status is failed even with 200 status
    if (data.BookingStatus === 'Failed') {
      return {
        success: false,
        message: `Booking failed: ${data.Status?.Description || 'Unknown error'}. Confirmation: ${data.ConfirmationNumber || 'N/A'}`,
        data: data
      };
    }
    
    return {
      success: true,
      message: 'Booking completed successfully',
      confirmationNumber: data.ConfirmationNumber || 'N/A',
      data: data
    };
  } catch (error) {
    console.error('Booking error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Booking failed. Please try again.',
    };
  }
};

// Complete booking flow
export const completeBooking = async (
  bookingCode: string,
  bookingReferenceId: string,
  customerData: any,
  bookingForm: any,
  totalFare: number,
  rooms: number = 1,
  guests: number = 1
): Promise<BookingResponse> => {
  try {
    const customerDetails = createCustomerDetails(bookingForm, rooms, guests);
    const clientReferenceId = generateClientReferenceId();
    
    // Generate a fallback booking code if none provided
    const finalBookingCode = bookingCode === 'default_booking_code' 
      ? `FALLBACK_${Date.now()}` 
      : bookingCode;
    
    // Try different booking types - this rate might not support Voucher
    const bookingRequest = {
      BookingCode: finalBookingCode,
      PaymentMode: 'Limit',
      CustomerDetails: customerDetails,
      BookingType: 'Instant', // Try Instant instead of Voucher
      ClientReferenceId: clientReferenceId,
      BookingReferenceId: bookingReferenceId,
      GuestNationality: 'AE',
      TotalFare: totalFare,
      EmailId: bookingForm.email,
      PhoneNumber: parseInt(bookingForm.phone) || 0
    };

    console.log('Making booking with data:', bookingRequest);
    
    const result = await makeBooking(bookingRequest);
    return result;
  } catch (error) {
    console.error('Complete booking flow error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Booking failed. Please try again.',
    };
  }
};
