import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { mockData } from './data';
import Provider from '../context/Provider';

describe('Testando o component Table', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
  });
  afterEach(jest.restoreAllMocks);
  test('Teste de os elementos do component Table é exibido', async () => {
    // Deve ser chamado o provider para que eu consiga testar o fetch e o retorno.
    render(
      <Provider>
        <App />
      </Provider>,
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
    screen.getByRole('heading', { name: /planets - star wars/i });
    screen.getByRole('textbox');
    screen.getByText(/coluna/i);
    screen.getByText(/operador/i);
    screen.getByText(/insira um numero:/i);
    screen.getByRole('button', { name: /filtrar/i });
    screen.getByRole('table');
    await screen.findByRole('columnheader', { name: /name/i });
    await screen.findByRole('cell', { name: /tatooine/i });
  });
  test('Teste se inserir os dados no input text, é filtrado corretamente', async () => {
    render(
      <Provider>
        <App />
      </Provider>,
    );
    const planet = 'tatooine';
    const inputText = screen.getByTestId('name-filter');
    userEvent.type(inputText, planet);
    screen.getByRole('table');
    await screen.findByRole('cell', { name: /tatooine/i });
    const row = await screen.findAllByRole('row');
    expect(row).toHaveLength(2);
    userEvent.clear(inputText);
  });
  test('Teste se inserir os dados nos filtros Coluna'
  + ', Operador e um valor, é filtrado corretamente ', async () => {
    render(
      <Provider>
        <App />
      </Provider>,
    );

    const inputText = screen.getByTestId('name-filter');
    const selectColumn = screen.getByTestId('column-filter');
    const operatorSelect = screen.getByTestId('comparison-filter');
    const inputNumber = screen.getByTestId('value-filter');
    const filterBtn = screen.getByTestId('button-filter');

    await screen.findByRole('cell', { name: /tatooine/i });
    userEvent.clear(inputText);
    userEvent.selectOptions(selectColumn, 'diameter');

    userEvent.selectOptions(operatorSelect, 'menor que');
    expect(operatorSelect).toHaveValue('menor que');
    userEvent.type(inputNumber, '8000');
    userEvent.click(filterBtn);
    await screen.findByRole('cell', { name: /hoth/i });
    await screen.findByRole('cell', { name: /endor/i });
    userEvent.clear(inputNumber);

    userEvent.selectOptions(selectColumn, 'population');
    expect(selectColumn).toHaveValue('population');
    userEvent.selectOptions(operatorSelect, 'maior que');
    expect(operatorSelect).toHaveValue('maior que');
    userEvent.type(inputNumber, '1000');
    userEvent.click(filterBtn);
    await screen.findByRole('cell', { name: /endor/i });
    userEvent.clear(inputNumber);

    userEvent.selectOptions(selectColumn, 'rotation_period');
    userEvent.selectOptions(operatorSelect, 'igual a');
    userEvent.type(inputNumber, '18');
    userEvent.click(filterBtn);
    await screen.findByRole('cell', { name: /endor/i });
  });
  test('Teste se ao clicar no botão de remover um filtro,'
  + ' ele é removido e a filtragem é corretamente feita', async () => {
    render(
      <Provider>
        <App />
      </Provider>,
    );

    const inputText = screen.getByRole('textbox');
    const selectColumn = screen.getByTestId('column-filter');
    const operatorSelect = screen.getByTestId('comparison-filter');
    const inputNumber = screen.getByTestId('value-filter');
    const filterBtn = screen.getByTestId('button-filter');

    await screen.findByRole('cell', { name: /tatooine/i });
    userEvent.clear(inputText);
    userEvent.selectOptions(selectColumn, 'diameter');

    userEvent.selectOptions(operatorSelect, 'menor que');
    expect(operatorSelect).toHaveValue('menor que');
    userEvent.type(inputNumber, '8000');
    userEvent.click(filterBtn);
    await screen.findByRole('cell', { name: /hoth/i });
    await screen.findByRole('cell', { name: /endor/i });
    userEvent.clear(inputNumber);
    userEvent.click(screen.getByRole('button', { name: /filtrar/i }));
    await screen.findByText(/rotation_period menor que 0/i);
    await screen.findAllByText(/x/i);
    const btn = await screen.findAllByText(/x/i);
    userEvent.click(btn[0]);
    userEvent.click(screen.getByRole('button', { name: /remover todas filtragens/i }));
    expect(await screen.queryByText(/rotation_period menor que 0/i)).not.toBeInTheDocument();
  });
});
