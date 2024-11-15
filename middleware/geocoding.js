import axios from 'axios';

export const geocodeAddress = async (address) => {
    try {
        const encodedAddress = encodeURIComponent(address);
        
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: encodedAddress,
                key: process.env.GOOGLE_MAPS_API_KEY,
                region: 'gh',
                bounds: '4.5,-1.5|11,1.5'
            }
        });

        if (response.data.status === 'ZERO_RESULTS') {
            console.log('No results found for address:', address);
            return null;
        }

        if (response.data.status === 'OK' && response.data.results && response.data.results[0]) {
            const location = response.data.results[0].geometry.location;
            return [location.lng, location.lat];
        }

        console.log('Geocoding response status:', response.data.status);
        return null;
    } catch (error) {
        console.error('Geocoding error:', error.response?.data || error.message);
        return null;
    }
};

export const calculateDistance = async (origin, destination) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: encodeURIComponent(origin),
                destinations: encodeURIComponent(destination),
                key: process.env.GOOGLE_MAPS_API_KEY,
                mode: 'driving',
                language: 'en',
                region: 'gh'
            }
        });

        if (response.data.status === 'OK' && 
            response.data.rows[0]?.elements[0]?.status === 'OK') {
            const distance = response.data.rows[0].elements[0].distance.value;
            return distance / 1000;
        }

        console.log('Distance Matrix response:', response.data);
        return null;
    } catch (error) {
        console.error('Distance calculation error:', error.response?.data || error.message);
        return null;
    }
};

export default { geocodeAddress, calculateDistance };