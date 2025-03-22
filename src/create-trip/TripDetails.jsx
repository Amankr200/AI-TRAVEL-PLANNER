import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../assets/components/custom/Header';
import axios from 'axios';
import { useSpring, animated, config, useTrail } from 'react-spring';
import './TripDetails.css';

const TravelIcons = () => {
  const icons = ["✈️", "🚗", "🏝️", "🏨", "🧳", "🗺️"];
  const [currentIcon, setCurrentIcon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 3000); // Change icon every 3 seconds
    return () => clearInterval(interval);
  }, [icons.length]);

  const trails = useTrail(icons.length * 2, { // Increase the number of icons
    from: { transform: "scale(0)", opacity: 0 },
    to: { transform: "scale(1.5)", opacity: 0.08 },
    config: { mass: 2, tension: 180, friction: 24 },
  });

  return (
    <div className="absolute w-full h-full overflow-hidden pointer-events-none">
      {trails.map((props, index) => (
        <animated.div
          key={index}
          style={{
            ...props,
            position: "absolute",
            fontSize: `${Math.random() * 2 + 2}rem`,
            left: `${Math.random() * 100}%`, // Use full screen width
            top: `${Math.random() * 100}%`, // Use full screen height
            zIndex: -1,
          }}
        >
          {icons[(currentIcon + index) % icons.length]}
        </animated.div>
      ))}
    </div>
  );
};

function TripDetails() {
  const location = useLocation();
  const { tripData } = location.state;

  const [hotelImages, setHotelImages] = useState({});
  const [activityImages, setActivityImages] = useState({});

  const fetchImage = async (query) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query, client_id: 'VuacIS1Pf6oKQ0Mb8hwg1x3PoV_3737Oq2u4gbP6x-E' },
      });
      
      if (response.data.results.length > 0) {
        console.log(`Fetched image for ${query}:`, response.data.results[0].urls.small);
        return response.data.results[0].urls.small;
      } else {
        console.warn(`No images found for query: ${query}`);
        return '';
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      return '';
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const hotelImagePromises = tripData.hotelOptions.map(async (hotel) => {
        const imageUrl = await fetchImage(hotel.hotelName);
        return { [hotel.hotelName]: imageUrl };
      });

      const activityImagePromises = Object.entries(tripData.itinerary).flatMap(([_, details]) =>
        details.activities.map(async (activity) => {
          const imageUrl = await fetchImage(activity.placeName);
          return { [activity.placeName]: imageUrl };
        })
      );

      const hotelImagesArray = await Promise.all(hotelImagePromises);
      const activityImagesArray = await Promise.all(activityImagePromises);

      const hotelImagesResult = Object.assign({}, ...hotelImagesArray);
      const activityImagesResult = Object.assign({}, ...activityImagesArray);

      setHotelImages(hotelImagesResult);
      setActivityImages(activityImagesResult);

      console.log("Hotel Images:", hotelImagesResult);
      console.log("Activity Images:", activityImagesResult);
    };

    fetchImages();
  }, [tripData]);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.div style={fadeIn} className="trip-details-container relative min-h-screen">
      <TravelIcons />
      <Header />
      <div className="p-5">
        <h2 className="trip-details-header">Your Trip Details</h2>
        <h3 className="trip-details-subheader">Location: {tripData.tripDetails.location}</h3>
        <h3 className="trip-details-subheader">Duration: {tripData.tripDetails.duration}</h3>
        <h3 className="trip-details-subheader">Budget: {tripData.tripDetails.budget}</h3>
        <h3 className="trip-details-subheader">Travelers: {tripData.tripDetails.travelers}</h3>

        <h3 className="font-bold text-2xl mt-6">Hotel Options:</h3>
        <ul className="trip-details-hotels">
          {tripData.hotelOptions.map((hotel, index) => (
            <li key={index} className="trip-details-item">
              <h4 className="hotel-name">{hotel.hotelName}</h4>
              <p className="hotel-address">{hotel.hotelAddress}</p>
              <p className="hotel-price">{hotel.price}</p>
              <img src={hotelImages[hotel.hotelName] || hotel.hotelImageUrl} alt={hotel.hotelName} className="trip-details-image" />
              <p className="hotel-rating">Rating: {hotel.rating}</p>
              <p className="hotel-description">{hotel.description}</p>
            </li>
          ))}
        </ul>

        <h3 className="font-bold text-2xl mt-6">Itinerary:</h3>
        <div className="trip-details-itinerary">
          {Object.entries(tripData.itinerary).map(([day, details]) => (
            <div key={day} className="trip-details-item">
              <h4 className="font-bold">{details.theme}</h4>
              <p className="best-time-to-visit">Best Time to Visit: {details.bestTimeToVisit}</p>
              <ul>
                {details.activities.map((activity, index) => (
                  <li key={index} className="trip-details-itinerary-item">
                    <h5 className="font-bold">{activity.placeName}</h5>
                    <p>{activity.placeDetails}</p>
                    <img src={activityImages[activity.placeName] || activity.placeImageUrl} alt={activity.placeName} className="trip-details-activity-image" />
                    <p className="ticket-pricing">Ticket Pricing: {activity.ticketPricing}</p>
                    <p className="time-to-travel">Time to Travel: {activity.timeToTravel}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </animated.div>
  );
}

export default TripDetails;
