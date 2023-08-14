import { render } from '@testing-library/react';
import App from './App';

describe('App', function () {
  it('should render StockSelector, DateSelector, and PriceTypeSelector components', () => {
    const { getByLabelText } = render(<App />);
    expect(getByLabelText('Search Stock Symbol')).toBeInTheDocument();
    expect(getByLabelText('Start Date')).toBeInTheDocument();
    expect(getByLabelText('Open')).toBeInTheDocument();
  });
});
