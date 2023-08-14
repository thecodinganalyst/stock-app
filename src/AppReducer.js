export default function appReducer(config, action){
    switch (action.type){
        case 'datesChanged': {
            return {
                ...config,
                start: action.start,
                end: action.end,
            }
        }
        case 'symbolsChanged': {
            return {
                ...config,
                symbols: action.symbols,
            }
        }
        case 'priceTypeChanged': {
            return {
                ...config,
                priceType: action.priceType,
            }
        }
        case 'dataChanged': {
            return {
                ...config,
                data: action.data,
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
