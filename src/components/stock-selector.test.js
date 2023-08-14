import {render, waitFor, act} from "@testing-library/react";
import StockSelector from "./stock-selector";
import userEvent from "@testing-library/user-event";
import {fetchStockSymbols} from "../utils/finnhub";
import { createTheme } from "@mui/material/styles";
jest.mock('../utils/finnhub', () => ({
    fetchStockSymbols: jest.fn() // mock the default export
}));
describe("stock-selector", () => {

    it('should set initial state correctly', async () => {
        fetchStockSymbols.mockResolvedValue([
            { symbol: 'AAPL' },
            { symbol: 'GOOG' }
        ]);
        const onSymbolsChanged = jest.fn();

        let getByRole, getByText;
        await act(async () => {
            // Wrap the render call inside act
            const result = render(<StockSelector initialStocks={['AAPL', 'GOOG']} onSymbolsChanged={onSymbolsChanged} />);
            getByRole = result.getByRole;
            getByText = result.getByText;
        });

        const autocomplete = getByRole('combobox');
        expect(autocomplete).toBeInTheDocument();
        const stock_aapl = getByText('AAPL');
        expect(stock_aapl).toBeInTheDocument();
        const stock_goog = getByText('GOOG');
        expect(stock_goog).toBeInTheDocument();
        expect(onSymbolsChanged).toHaveBeenCalledTimes(0);
    });

    it('should call onSymbolsChanged when selecting symbols', async () => {

        fetchStockSymbols.mockResolvedValue([
            { symbol: 'AAPL' },
            { symbol: 'GOOG' },
            { symbol: 'TSLA' }
        ]);

        const onSymbolsChanged = jest.fn();
        const { getByRole, getByText } = render(
            <StockSelector initialStocks={['AAPL', 'GOOG']} onSymbolsChanged={onSymbolsChanged} />
        );

        const autocomplete = getByRole('combobox');
        await act(async () => {
            userEvent.click(autocomplete);
        });

        await act(async () => {
            userEvent.type(autocomplete, 'TSLA');
        });

        expect(autocomplete.value).toBe('TSLA');

        await act(async () => {
            await waitFor(() => getByText('TSLA'));
            userEvent.click(getByText('TSLA'));
        });

        expect(onSymbolsChanged).toHaveBeenCalledTimes(1);
        expect(onSymbolsChanged).toHaveBeenCalledWith(['AAPL', 'GOOG', 'TSLA']);
    });

    it('should render selected symbols as Chips with correct background color', async () => {
        fetchStockSymbols.mockResolvedValue([
            {symbol: 'AAPL'},
            {symbol: 'GOOG'},
            {symbol: 'TSLA'}
        ]);

        const onSymbolsChanged = jest.fn();

        let getByRole
        await act(async () => {
            // Wrap the render call inside act
            const result = render(<StockSelector initialStocks={['AAPL', 'GOOG', 'TSLA']}
                                                 onSymbolsChanged={onSymbolsChanged}/>);
            getByRole = result.getByRole;
        });

        const theme = createTheme();
        const primaryColor = theme.palette.primary.main;
        const secondaryColor = theme.palette.secondary.main;
        const errorColor = theme.palette.error.main;
        const aapl_chip = getByRole('button', {name: /AAPL/});
        expect(aapl_chip).toBeInTheDocument();
        expect(aapl_chip).toHaveStyle(`background-color: ${primaryColor}`);
        const goog_chip = getByRole('button', {name: /GOOG/});
        expect(goog_chip).toBeInTheDocument();
        expect(goog_chip).toHaveStyle(`background-color: ${secondaryColor}`);
        const tsla_chip = getByRole('button', {name: /TSLA/});
        expect(tsla_chip).toBeInTheDocument();
        expect(tsla_chip).toHaveStyle(`background-color: ${errorColor}`);
    });
})
