import {useEffect, useState} from "react";
import {fetchStockSymbols} from "../utils/finnhub";
import {Autocomplete, Chip, TextField} from "@mui/material";
import {useTheme} from "@mui/material/styles";

export default function StockSelector({ initialStocks, onSymbolsChanged }){
    const [symbols, setSymbols] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(initialStocks);

    useEffect( () => {
        fetchStockSymbols('US').then(
            json => {
                setSymbols(json);
                setLoading(false);
            }
        ).catch(() => {
            console.error("Failed to fetch stock symbols");
            setLoading(false);
        })
    }, [])

    const handleAutocompleteChanged = (event, newValue) => {
        if(newValue.length <= 3) {
            setSelected(newValue);
            if(onSymbolsChanged) {
                onSymbolsChanged(newValue);
            }
        }
    }

    const theme = useTheme();
    const colors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.error.main
    ];

    return (
        <Autocomplete
            multiple
            id="stockList"
            loading={loading}
            options={symbols.map(option => option.symbol)}
            value={selected}
            onChange={handleAutocompleteChanged}
            renderInput={(params) => <TextField {...params} label="Search Stock Symbol" />}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                    return (
                        <Chip
                            key={index}
                            variant="filled"
                            label={option}
                            {...getTagProps({ index })}
                            style={{ backgroundColor: colors[index], color: 'white' }}
                        />
                    );
                })
            }
        />
    );
}
