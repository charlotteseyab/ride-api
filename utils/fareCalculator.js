export const calculateFare = (distanceInKm, options = {}) => {
    const {
        timeOfDay = new Date(),
        vehicleType = 'standard',
        trafficMultiplier = 1,
    } = options;

    // Base rates
    const rates = {
        standard: {
            baseFare: 50,
            perKm: 20,
            minimumFare: 100
        },
        premium: {
            baseFare: 100,
            perKm: 30,
            minimumFare: 150
        }
    };

    // Surge pricing multiplier based on time of day
    const hour = timeOfDay.getHours();
    let surgeMultiplier = 1;
    if (hour >= 6 && hour <= 9) surgeMultiplier = 1.2; // Morning rush
    if (hour >= 16 && hour <= 19) surgeMultiplier = 1.3; // Evening rush

    const rate = rates[vehicleType];
    
    // Calculate fare
    const baseFare = rate.baseFare;
    const distanceCost = distanceInKm * rate.perKm;
    
    // Apply multipliers
    const subtotal = (baseFare + distanceCost) * surgeMultiplier * trafficMultiplier;
    
    // Round to nearest whole number and ensure minimum fare
    const finalFare = Math.max(
        Math.round(subtotal), 
        rate.minimumFare
    );

    return {
        amount: finalFare,
        breakdown: {
            baseFare,
            distanceCost,
            surgeMultiplier,
            trafficMultiplier,
            subtotal,
            finalFare
        }
    };
}; 