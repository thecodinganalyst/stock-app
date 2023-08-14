import {render} from "@testing-library/react";
import Chart from "./chart";

describe("chart", () => {

    it('should render with provided dataSets and xTimestampSets props', () => {
        const dataSets = new Map([
            ['AAPL', [1, 2, 3]],
            ['GOOG', [4, 5, 6]]
        ]);
        const timestamps = [1000, 2000, 3000];
        const { container } = render(<Chart dataSets={dataSets} timestamps={timestamps} />);
        expect(container).toMatchSnapshot();
    });

    it('should render with custom props', () => {
        const dataSets = new Map([
            ['AAPL', [1, 2, 3]],
            ['GOOG', [4, 5, 6]]
        ]);
        const timestamps = [1000, 2000, 3000];
        const { container } = render(<Chart dataSets={dataSets} timestamps={timestamps} width={500} height={300} marginTop={10} marginRight={20} marginBottom={30} marginLeft={40} />);
        expect(container).toMatchSnapshot();
    });

})
