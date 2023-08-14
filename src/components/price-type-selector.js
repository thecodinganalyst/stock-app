import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useState} from "react";

export default function PriceTypeSelector({initial="o", onPriceTypeChanged}){
    const [selected, setSelected] = useState(initial);

    const handleSelection = (event, newSelection) => {
        setSelected(newSelection);
        if(onPriceTypeChanged){
            onPriceTypeChanged(newSelection);
        }
    };

    return (
        <ToggleButtonGroup
            fullWidth
            value={selected}
            exclusive
            onChange={handleSelection}
            aria-label="selection"
        >
            <ToggleButton value="o" aria-label="open">
                Open
            </ToggleButton>
            <ToggleButton value="c" aria-label="closed">
                Closed
            </ToggleButton>
            <ToggleButton value="h" aria-label="high">
                High
            </ToggleButton>
            <ToggleButton value="l" aria-label="low">
                Low
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
