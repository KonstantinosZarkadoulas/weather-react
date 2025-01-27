import React, { useContext, Suspense, lazy, useState, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";
import HeaderComponent from "./components/header/HeaderComponent";
import FooterComponent from "./components/footer/FooterComponent";
import LoaderComponent from "./components/loader/LoaderComponent";
import ReactGA from "react-ga";

const HomeContainer = lazy(() => import("./containers/home/HomeContainer"));

const GA_ID = process.env.REACT_APP_GA_ID;

// reactGA initialization
ReactGA.initialize(`${GA_ID}`);

const App = () => {
  const { theme } = useContext(ThemeContext);

  // New flood alert feature state
  const [weatherData, setWeatherData] = useState(null);
  const [floodAlert, setFloodAlert] = useState(false);

  // Simulated weather data fetch
  useEffect(() => {
    const fetchWeatherData = async () => {
      const simulatedResponse = {
        weather: [{ main: "Rain" }],
        rain: { "1h": 30 }, // Simulating heavy rain in mm/hour
      };

      setWeatherData(simulatedResponse);

      // Check for flood conditions
      if (simulatedResponse.rain && simulatedResponse.rain["1h"] >= 20) {
        setFloodAlert(true);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className={`bg-${theme} tracking-wider border-box wrapper`}>
      {/* Flood Alert Notification */}
      {floodAlert && (
        <div
          style={{
            backgroundColor: "#ffcccc",
            padding: "10px",
            borderRadius: "5px",
            margin: "20px 0",
            textAlign: "center",
          }}
        >
          <strong>Flood Alert:</strong> Heavy Rainfall Expected! Stay Safe!
        </div>
      )}

      <div>
        <HeaderComponent />
      </div>
      <div>
        <Suspense fallback={<LoaderComponent loaderText="Loading components" />}>
          <HomeContainer />
        </Suspense>
      </div>
      <div>
        {weatherData ? (
          <p style={{ textAlign: "center" }}>
            Current Weather: <strong>{weatherData.weather[0].main}</strong>
          </p>
        ) : (
          <p style={{ textAlign: "center" }}>Loading weather data...</p>
        )}
      </div>
      <div>
        <FooterComponent />
      </div>
    </div>
  );
};

export default App;
