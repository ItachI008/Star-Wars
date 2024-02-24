import React, { useState, useEffect } from 'react';
import videoBG from '../assets/videoBG.mp4';
import './Main.css'; 

const Main = () => {
  const [planets, setPlanets] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchPlanets('https://swapi.dev/api/planets/?format=json');
  }, []); // Fetching  planets for rendring

  const fetchPlanets = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPlanets(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (error) {
      console.error('Error fetching planets:', error);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchPlanets(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchPlanets(prevPage);
    }
  };

  return (
    <div className="main">
      <div className="video-container">
        <video autoPlay loop muted>
          <source src={videoBG} type="video/mp4" />
        </video>
      </div>
      <div className="overlay"></div>
      <div className="content">
        <h1>Star Wars Information </h1>
        
        <div className="planet-list">
          {planets.map((planet, index) => (
            <PlanetCard key={index} planet={planet} />
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={!prevPage}>
            Previous Page
          </button>
          <button onClick={handleNextPage} disabled={!nextPage}>
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanetCard = ({ planet }) => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    fetchResidents();
  }, []); // Residents are fetched after components r loaded

  const fetchResidents = async () => {
    try {
      const promises = planet.residents.map((residentUrl) => fetch(residentUrl));
      const responses = await Promise.all(promises);
      const residentsData = await Promise.all(responses.map((res) => res.json()));
      setResidents(residentsData);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  return (
    <div className="planet-card">
      <h2>{planet.name}</h2>
      <p>Climate: {planet.climate}</p>
      <p>Population: {planet.population}</p>
      <p>Terrain: {planet.terrain}</p>
      <h3>Residents:</h3>
      <ul>
        {residents.map((resident, index) => (
          <li key={index}>
            {resident.name} - {resident.height}cm - {resident.mass}kg - {resident.gender}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
