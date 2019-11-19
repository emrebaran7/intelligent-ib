import {getConsolidatedBankNames} from "./_helperFunctions"

const data = require("../../assets/data/processed/new_data.json")

export function getMissingBanks(data){
    const consolidatedBankNames = getConsolidatedBankNames();
    const missingBanks = []

    for (let i = 0; i < data.length; i++){
        let underwriters = data[i].underwriters;
        let bankNames;
        if (underwriters !== null) {bankNames = Object.keys(underwriters)}
        
        if (bankNames !== undefined) {
            for (let y = 0; y < bankNames.length; y++ ){
                let bank = bankNames[y];
                if (consolidatedBankNames[bank] === undefined) {missingBanks.push(bank);}
            }
        }
    }

    console.log(missingBanks)
    return missingBanks;
}

