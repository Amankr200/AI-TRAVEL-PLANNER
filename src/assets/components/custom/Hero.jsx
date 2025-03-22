import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated, config, useTrail } from 'react-spring';

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

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
    config: { tension: 200, friction: 20 },
    delay: 200,
  });
  
  const titleAnimation = useSpring({
    from: { 
      transform: 'perspective(1000px) rotateX(30deg) translateZ(-100px)', 
      opacity: 0 
    },
    to: { 
      transform: 'perspective(1000px) rotateX(0deg) translateZ(0px)', 
      opacity: 1 
    },
    config: config.gentle,
    delay: 300,
  });
  
  const floatAnimation = useSpring({
    from: { transform: 'translateY(10px) translateZ(-20px)' },
    to: async (next) => {
      while (true) {
        await next({ 
          transform: 'translateY(-10px) translateZ(0px)',
          config: { duration: 2500 }
        });
        await next({ 
          transform: 'translateY(10px) translateZ(-20px)',
          config: { duration: 2500 }
        });
      }
    },
  });
  
  const buttonAnimation = useSpring({
    from: { 
      transform: 'perspective(1000px) scale(0.9) rotateX(20deg) translateZ(-50px)', 
      opacity: 0 
    },
    to: { 
      transform: 'perspective(1000px) scale(1) rotateX(0deg) translateZ(0px)', 
      opacity: 1 
    },
    config: { tension: 300, friction: 10 },
    delay: 800,
  });

  const parallaxBg = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ 
          transform: 'translateY(-20px)',
          config: { duration: 3000 }
        });
        await next({ 
          transform: 'translateY(0px)',
          config: { duration: 3000 }
        });
      }
    },
  });

  return (
    <div 
      className='relative flex flex-col items-center gap-9 min-h-[90vh] overflow-hidden'
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <TravelIcons />
      
      <animated.h1 
        style={titleAnimation} 
        className='font-extrabold text-[60px] text-center mt-25 relative'
      >
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> <br></br>Personalized Itineraries at Your Fingertips
      </animated.h1>
      
      <animated.p 
        style={floatAnimation} 
        className='text-2xl text-gray-500 text-center relative' // Increased text size
      >
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </animated.p>
      
      <Link to={'/create-trip'}>
        <animated.button 
          style={buttonAnimation} 
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:translate-y-[-5px]"
        >
          Get Started, It's Free
        </animated.button>
      </Link>

      <animated.div style={parallaxBg} className="absolute inset-0 z-[-2]">
        <div className="absolute top-20 left-20 w-40 h-40 bg-orange-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-red-100 rounded-full opacity-20 blur-xl"></div>
      </animated.div>
    </div>
  );
}

export default Hero;
