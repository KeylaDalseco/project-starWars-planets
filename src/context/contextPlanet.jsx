import { createContext } from 'react';

const INITIAL_STATE = {
  planets: [],
};

const contextPlanet = createContext(INITIAL_STATE);

export default contextPlanet;
