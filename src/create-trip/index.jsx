import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "../constents/options";
import { chatSession } from "../service/AIModal";
import { useNavigate } from 'react-router-dom';
import Header from '../assets/components/custom/Header';

function CreateTrip() {
  const navigate = useNavigate();
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({
    location: null,
    noOfDays: '',
    budget: '',
    traveler: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const OnGenerateTrip = async () => {
    if (!formData.location || !formData.budget || !formData.traveler) {
      alert("Please fill in all fields before generating the trip.");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location.label)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);

    console.log(FINAL_PROMPT);
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());

    setLoading(false);

    navigate('/trip-details', { state: { tripData: JSON.parse(result?.response?.text()) } });
  };

  return (
    <div>
      <Header />
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-56 xl:px-10 px-5 mt-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <h2 className="font-bold text-3xl">Tell us your travel preferences ⛺🌴</h2>
            <p className="mt-3 text-gray-500 text-xl">
              Just provide some basic information, and our trip planner will generate
              a customized itinerary based on your preferences.
            </p>

            <div className="mt-20 flex flex-col gap-10">
              <div>
                <h2 className="text-xl my-3 font-medium">What is destination of choice?</h2>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                  selectProps={{
                    place,
                    onChange: (v) => {
                      setPlace(v);
                      handleInputChange('location', v);
                    }
                  }}
                />
              </div>
              <div className="mt-5 ">
                <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
                <input 
                  placeholder={"Ex.3"} 
                  type="number" 
                  className="w-full h-12 border rounded-lg p-2"
                  value={formData.noOfDays}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value < 1 || value > 5) {
                      e.target.value = 5;
                    } else {
                      handleInputChange('noOfDays', value);
                    }
                  }}
                />
              </div>
              <div className="mt-5 ">
                <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
                <div className="grid grid-cols-3 gap-5 mt-5">
                  {SelectBudgetOptions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleInputChange('budget', item.title)}
                      className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
                        ${formData.budget === item.title ? 'shadow-lg border-2 border-black' : ''}`}
                    >
                      <h2 className="text-4xl">{item.icon}</h2>
                      <h2 className="font-bold text-lg">{item.title}</h2>
                      <h2 className="text-sm text-gray-500">{item.desc}</h2>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 ">
                <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with on your next adventure?</h2>
                <div className="grid grid-cols-3 gap-5 mt-5">
                  {SelectTravelesList.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleInputChange('traveler', item.people)}
                      className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                        ${formData.traveler === item.people ? 'shadow-lg border-2 border-black' : ''}`}
                    >
                      <h2 className="text-4xl">{item.icon}</h2>
                      <h2 className="font-bold text-lg">{item.title}</h2>
                      <h2 className="text-sm text-gray-500">{item.desc}</h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='my-10 justify-end flex'>
              <button onClick={OnGenerateTrip} className="text-orange-500">Generate Trip</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateTrip;
