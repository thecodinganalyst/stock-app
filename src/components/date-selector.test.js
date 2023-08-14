import {fireEvent, render, screen} from '@testing-library/react'
import DateSelector from './date-selector'

describe("date-selector", () => {

    it("Tests that the component renders two date input fields with correct labels and values", async () => {
        render(<DateSelector start='2022-01-01' end='2022-01-31' />);
        const startDateInput = screen.getByLabelText('Start Date');
        const endDateInput = screen.getByLabelText('End Date');
        expect(startDateInput).toHaveValue('2022-01-01');
        expect(endDateInput).toHaveValue('2022-01-31');
    })

    it("Tests that onDatesChanged is called with correct arguments when start date is changed", async () => {
        const onDatesChanged = jest.fn();
        render(<DateSelector start='2022-01-01' end='2022-01-31' onDatesChanged={onDatesChanged} />);
        const startDateInput = screen.getByLabelText('Start Date');
        fireEvent.change(startDateInput, { target: { value: '2022-01-02' } });
        expect(onDatesChanged).toHaveBeenCalledWith('2022-01-02', '2022-01-31');
    })

    it('should call onDatesChanged with correct arguments when end date is changed', () => {
        const onDatesChanged = jest.fn();
        render(<DateSelector start='2022-01-01' end='2022-01-31' onDatesChanged={onDatesChanged} />);
        const endDateInput = screen.getByLabelText('End Date');
        fireEvent.change(endDateInput, { target: { value: '2022-02-01' } });
        expect(onDatesChanged).toHaveBeenCalledWith('2022-01-01', '2022-02-01');
    });
})

