import {fireEvent, render} from "@testing-library/react";
import PriceTypeSelector from "./price-type-selector";

describe("price-type-selector", () => {
    it('should render with default value o when initial prop is not provided', () => {
        const { getByRole } = render(<PriceTypeSelector />);
        const selectedButton = getByRole('button', { name: /open/i });
        expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should render with selected state of component when initial prop is provided', () => {
        const { getByRole } = render(<PriceTypeSelector initial="c" />);
        const selectedButton = getByRole('button', { name: /closed/i });
        expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should change selected state of component immediately when toggle button is clicked', () => {
        const { getByRole } = render(<PriceTypeSelector />);
        const closedButton = getByRole('button', { name: /closed/i });
        fireEvent.click(closedButton);
        expect(closedButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should call onPriceTypeChanged callback with correct new selection when toggle button is clicked', () => {
        const mockCallback = jest.fn();
        const { getByRole } = render(<PriceTypeSelector onPriceTypeChanged={mockCallback} />);
        const highButton = getByRole('button', { name: /high/i });
        fireEvent.click(highButton);
        expect(mockCallback).toHaveBeenCalledWith('h');
    });
})
