import { Client } from '@googlemaps/google-maps-services-js';

const googleMapsClient = new Client({});

async function geocodeAddress(address) {
  try {
    const response = await googleMapsClient.geocode({
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.results && response.data.results[0]) {
      const location = response.data.results[0].geometry.location;
      return [location.lng, location.lat]; // MongoDB expects [longitude, latitude]
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

async function calculateDistance(origin, destination) {
  try {
    const response = await googleMapsClient.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.rows[0].elements[0].distance) {
      return response.data.rows[0].elements[0].distance.value / 1000; // Convert to kilometers
    }
    return null;
  } catch (error) {
    console.error('Distance calculation error:', error);
    return null;
  }
}

export default { geocodeAddress, calculateDistance };