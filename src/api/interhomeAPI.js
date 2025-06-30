import API from "./config";

export const fetchInterhomePrices = async ({
  accommodationCode,
  checkInDate = null,
  pax = null,
  duration = null,
  los = true,
}) => {
  try {
    const response = await API.get(`/interhome/prices/${accommodationCode}`, {
      params: {
        checkInDate,
        pax,
        duration,
        los,
      },
    });

    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch Interhome prices: ${error.message}`);
    throw error;
  }
};

export const fetchInterhomeListingPrices = async (data) => {
  try {
    const response = await API.post(`/interhome/accommodation/price`, data
     
    );

    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch Interhome prices: ${error.message}`);
    throw error;
  }
};

export const checkBookingPossible = async (data) => {
  try {
    const response = await API.post(`/interhome/booking/check`, data
     
    );

    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch Interhome booking check: ${error.message}`);
    throw error;
  }
};

// Add this function to your existing interhomeAPI.js file

export const fetchInterhomeAvailability = async (accommodationCode) => {
  try {
    console.log(
      "Fetching availability for accommodation code:",
      accommodationCode
    ); // Log the accommodation code for debugging
    // Use the API instance which should handle the base URL and proxy
    const response = await API.get(
      `/interhome/availability/${accommodationCode}`
    );

    // The API instance likely handles response data extraction, so we return response.data directly
    // console.log("Fetched availability data:", response.data); // Log the fetched data for debugging
    return response.data;
  } catch (error) {
    // The API instance might also handle errors, but we keep the console log for now
    console.error("Error in fetchInterhomeAvailability:", error.message);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
};

export const fetchInterhomeVacancies = async (accommodationCode) => {
  try {
    console.log(
      "Fetching vacancies for accommodation code:",
      accommodationCode
    ); // Log the accommodation code for debugging
    // Use the API instance which should handle the base URL and proxy
    const response = await API.get(
      `/interhome/vacancies/${accommodationCode}`
    );

    // The API instance likely handles response data extraction, so we return response.data directly
    // console.log("Fetched availability data:", response.data); // Log the fetched data for debugging
    return response.data?.data;
  } catch (error) {
    // The API instance might also handle errors, but we keep the console log for now
    console.error("Error in interhome vacancies:", error.message);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
};
