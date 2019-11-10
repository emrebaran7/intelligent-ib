import {stylizeString} from './stylizeBankNames';
require("babel-polyfill");

// get consolidation database
export async function fetchData() {
    const consolidatedBanksNames = {}
    const data = await d3.csv("assets/data/raw/bank-name-consol.csv")
    for (const datum of data) {
        const row = datum;
        const key = row["input_name"];
        const value = stylizeString(row["output_name"]);
        consolidatedBanksNames[key] = value;
    }
    return consolidatedBanksNames
}

//gets banks from dataset
export const getUniqueBanksInput = (data) => {
    const bankSet = new Set();
    for (let i = 0; i < data.length; i++) {
        if (data[i].underwriters === null) {
            let bank = null
            bankSet.add(bank);
        } else {
            let bankItems = (Object.keys(data[i].underwriters));
            for (let i = 1; i < bankItems.length; i++) {
                bankSet.add((bankItems[i]));
            }
        }
    }

    return bankSet;
}

//gets a list of all banks
export const getBanks = async (bankInputSet) => {
    
    const consolidatedBanksNames = await fetchData()
    
    const banksArray = Array.from(bankInputSet)
    
    const banksOutput = []
    for (let i = 0; i < banksArray.length; i++) {
        let bankInput = banksArray[i];
        let pushable = consolidatedBanksNames[bankInput];
        if (!banksOutput.includes(pushable) && pushable !== undefined) {
            banksOutput.push(pushable);
        }
    }
    
    return banksOutput;
}
