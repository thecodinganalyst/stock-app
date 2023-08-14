import './App.css';
import {Container, Grid} from "@mui/material";
import StockSelector from "./components/stock-selector";
import DateSelector from "./components/date-selector";
import Chart from "./components/chart";
import PriceTypeSelector from "./components/price-type-selector";
import {useCallback, useEffect, useState} from "react";
import {fetchStockCandles} from "./utils/finnhub";

function App() {
    const [start, setStart] = useState(formatDate(oneYearBefore));
    const [end, setEnd] = useState(formatDate(today));
    const [selectedSymbols, setSelectedSymbols] = useState([]);
    const [priceType, setPriceType] = useState('o')
    const [data, setData] = useState(new Map());
    const [timestamps, setTimestamps] = useState([]);

    const handleSelectedSymbolsChanged = (selectedSymbols) => {
        console.log(`selected symbols - ${selectedSymbols}`)
        setSelectedSymbols(selectedSymbols);
    }

    const handleDatesChanged = (start, end) => {
        setStart(start);
        setEnd(end);
    }

    const handlePriceTypeChanged = (priceType) => {
        setPriceType(priceType);
    }

    const fetchStockCandlesForSymbol = useCallback((symbol, from, to) => {
        fetchStockCandles(symbol, from.getTime() / 1000, to.getTime() / 1000).then(
            json => {
                if(json.s === 'ok'){
                    console.log(`filtered values for price type = ${priceType}`);
                    setData((curr) => {
                        const newData = new Map(curr);
                        newData.set(symbol, json[priceType]);
                        return newData;
                    });
                    setTimestamps(json['t']);
                }else{
                    alert('no data');
                }
            }
        )
    }, [priceType, setData, setTimestamps]);

    const fetchData = useCallback(() => {
        if(selectedSymbols.length === 0) return;
        const from = new Date(start);
        const to = new Date(end);
        setData([]);
        setTimestamps([]);
        for (const symbol of selectedSymbols) {
            fetchStockCandlesForSymbol(symbol, from, to);
        }
    }, [selectedSymbols, start, end, setData, setTimestamps, fetchStockCandlesForSymbol])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Container maxWidth="lg" sx={{padding: '1em'}}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <StockSelector initialStocks={selectedSymbols} onSymbolsChanged={handleSelectedSymbolsChanged} />
                        </Grid>
                        <Grid item>
                            <DateSelector start={start} end={end} onDatesChanged={handleDatesChanged} />
                        </Grid>
                        <Grid item>
                            <PriceTypeSelector initial={priceType} onPriceTypeChanged={handlePriceTypeChanged} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Chart dataSets={data} xTimestampSets={timestamps}/>
                </Grid>
            </Grid>
        </Container>
    );
}

const today = new Date();
const oneYearBefore = new Date(today);
oneYearBefore.setFullYear(today.getFullYear() - 1);

// Convert dates to YYYY-MM-DD string format
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export default App;
