import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../assets/components/custom/Header';
import axios from 'axios';
import './TripDetails.css';

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

  return (
    <div className="trip-details-container">
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
    </div>
  );
}

export default TripDetails;
