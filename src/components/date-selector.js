import {useState} from "react";
import {Box, TextField} from "@mui/material";

export default function DateSelector({start, end, onDatesChanged}){

    const [startDate, setStartDate] = useState(start);
    const [endDate, setEndDate] = useState(end);

    const handleStartDateChanged = (event) => {
        setStartDate(event.target.value);
        if(onDatesChanged){
            onDatesChanged(event.target.value, endDate);
        }
    }

    const handleEndDateChanged = (event) => {
        setEndDate(event.target.value);
        if(onDatesChanged){
            onDatesChanged(startDate, event.target.value);
        }
    }

    return (
        <Box display="flex" gap={2}>
            <TextField
                fullWidth
                label="Start Date"
                type="date"
                variant="outlined"
                value={startDate}
                onChange={handleStartDateChanged}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{ inputProps: { max: endDate } }}
            />
            <TextField
                fullWidth
                label="End Date"
                type="date"
                variant="outlined"
                value={endDate}
                onChange={handleEndDateChanged}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{ inputProps: { min: startDate } }}
            />
        </Box>
    );
}
