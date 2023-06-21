import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import contextPlanet from './contextPlanet';

function Provider({ children }) {
  // crio um estado local e armazeno com o fetch da API
  const [planets, setPlanets] = useState([]);

  // faço o fetch da API
  const fetchData = async () => {
    const URL = 'https://swapi.dev/api/planets';
    const response = await fetch(URL);
    const planetas = await response.json();
    const dataWithoutResidents = planetas.results
      .filter((planet) => delete planet.residents);
    // console.log(dataWithoutResidents);
    return setPlanets(dataWithoutResidents);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useMemo é uma cópia dos valores para melhorar o desempenho dos valores
  const value = useMemo(() => ({
    planets, setPlanets, fetchData,
  }), [planets]);

  return (
    <contextPlanet.Provider value={ value }>
      { children }
    </contextPlanet.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Provider;
