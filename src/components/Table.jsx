import { useContext, useEffect, useState } from 'react';
import contextPlanet from '../context/contextPlanet';
import './table.css';

function Table() {
  // dado recuperado através do useContext
  const { planets } = useContext(contextPlanet);

  const [namePlanet, setNamePlanet] = useState('');

  // invés de criar manualmente o select, criei de forma dinamica para excluir e adicionar de volta
  const [selectValue1Options, setSelectValue1Options] = useState([
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ]);
  const [selectValue2Options, setSelectValue2Options] = useState([
    'maior que',
    'menor que',
    'igual a',
  ]);
  const [selectValue1, setSelectValue1] = useState('population');
  const [selectValue2, setSelectValue2] = useState('maior que');
  const [inputTextValue, setInputTextValue] = useState(0);
  const [filterPlanets, setFilterPlanets] = useState([]);
  // Só para exibir as colunas filtradas
  const [filteredColumnName, setFilteredColumnName] = useState([]);
  // crio uma cópia para tratar os valores
  const [availableColumns, setAvailableColumns] = useState(selectValue1Options);
  useEffect(() => {
    setFilterPlanets(planets);
  }, [planets]);

  function defaultSelect() {
    setSelectValue1(selectValue1Options[3]);
  }

  function filterInputs() {
    const filterInput = filterPlanets.filter((planet) => {
      const verifySelect1 = planet[selectValue1];
      switch (selectValue2) {
      case 'maior que':
        return verifySelect1 > Number(inputTextValue);
      case 'menor que':
        return verifySelect1 < Number(inputTextValue);
      default:
        return verifySelect1 === inputTextValue;
      }
    });
    setFilterPlanets([...filterInput]);
    setFilteredColumnName((prevFilteredColumnName) => [
      ...prevFilteredColumnName,
      { colum: selectValue1,
        comparison: selectValue2,
        value: Number(inputTextValue) }]);

    const filteredSelectValue1Options = availableColumns
      .filter((option) => option !== selectValue1);
    setAvailableColumns(filteredSelectValue1Options);
    setSelectValue2Options(['maior que', 'menor que', 'igual a']);
    defaultSelect();
  }
  function removeAFilter(columnFiltered) {
    const filter = filteredColumnName
      .filter((column) => column.colum !== columnFiltered.colum);
    const { colum } = columnFiltered;
    if (!availableColumns.includes(colum)) {
      const updatedAvailableColumns = [...availableColumns, colum];
      setAvailableColumns(updatedAvailableColumns);
    }

    if (filter.length === 0) {
      setFilterPlanets([...planets]);
      setFilteredColumnName([]);
      return;
    }

    const filterInput = planets.filter((planet) => filter.every((filterItem) => {
      const { comparison, value } = filterItem;
      const planetValue = Number(planet[colum]);

      if (comparison === 'maior que') {
        return planetValue > Number(value);
      }
      if (comparison === 'menor que') {
        return planetValue < Number(value);
      }
      return planetValue === Number(value);
    }));
    console.log(filterInput);
    setFilteredColumnName(filter);
    setFilterPlanets(filterInput);
  }
  function removeAllFilters() {
    setFilteredColumnName([]);
    setSelectValue1Options([
      'population',
      'orbital_period',
      'diameter',
      'rotation_period',
      'surface_water',
    ]);
    setSelectValue2Options([
      'maior que',
      'menor que',
      'igual a',
    ]);
    setSelectValue1(selectValue1Options[0]);
    setSelectValue2('maior que');
    setInputTextValue(0);
    setFilterPlanets([...planets]);
  }

  return (
    <div>
      <input
        type="text"
        data-testid="name-filter"
        value={ namePlanet }
        placeholder="Pesquise um planeta..."
        onChange={ ({ target }) => setNamePlanet((target.value)) }
      />
      <br />
      <br />
      <div>
        <label htmlFor="select1">
          {'Coluna '}
          <select
            name="selectValue1"
            id="select1"
            data-testid="column-filter"
            value={ selectValue1 }
            onChange={ ({ target }) => setSelectValue1((target.value)) }
          >
            {/* criando as options dinamicamente, para filtrar fica mais fácil */}
            {availableColumns.map((option) => (
              <option key={ option } value={ option }>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="select2">
          {' Operador '}
          <select
            name="selectValue2"
            id="select2"
            data-testid="comparison-filter"
            value={ selectValue2 }
            onChange={ ({ target }) => setSelectValue2((target.value)) }
          >
            {/* criando as options dinamicamente, para filtrar fica mais fácil */}
            {selectValue2Options.map((option) => (
              <option key={ option } value={ option }>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="inputText">{' Insira um numero: '}</label>
        <input
          id="inputText"
          type="number"
          data-testid="value-filter"
          value={ inputTextValue }
          placeholder="Pesquise um planeta..."
          onChange={ ({ target }) => setInputTextValue((target.value)) }
        />
        <button
          type="button"
          data-testid="button-filter"
          onClick={ filterInputs }
        >
          Filtrar
        </button>
      </div>
      <div>
        <button
          type="button"
          data-testid="button-remove-filters"
          onClick={ () => removeAllFilters() }
        >
          Remover todas filtragens
        </button>
      </div>
      <br />
      { filteredColumnName.length > 0 && filteredColumnName.map((columfiltered, i) => (
        <div data-testid="filter" key={ i }>
          <span>
            Filtrando por
            {' '}
            <strong>
              {`${columfiltered.colum}
            ${columfiltered.comparison} ${columfiltered.value}`}
            </strong>
          </span>
          <button
            type="button"
            onClick={ () => removeAFilter(columfiltered) }
          >
            X
          </button>
        </div>
      ))}
      <table className="table">
        <thead>
          <tr>
            {planets.length > 0 && Object.keys(planets[0]).map((key, i) => (
              <th key={ i }>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          { filterPlanets
            .filter((planet) => planet.name.toLowerCase().includes(namePlanet))
            .map((planet, index) => (
              <tr key={ index }>
                <td>{planet.name}</td>
                <td>{planet.rotation_period}</td>
                <td>{planet.orbital_period}</td>
                <td>{planet.diameter}</td>
                <td>{planet.climate}</td>
                <td>{planet.gravity}</td>
                <td>{planet.terrain}</td>
                <td>{planet.surface_water}</td>
                <td>{planet.population}</td>
                <td>{planet.films}</td>
                <td>{planet.created}</td>
                <td>{planet.edited}</td>
                <td>{planet.url}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default Table;
