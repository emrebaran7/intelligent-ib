import {stylizeString} from './stylizeBankNames'
let consolidatedBanksNames = new Object

d3.csv("/assets/data/raw/bank-name-consol.csv").then(function (data) {

    for (let i = 0; i < data.length; i++){
        let row = data[i];
        let key = row["input_name"];
        let value = stylizeString(row["output_name"]);   
        consolidatedBanksNames[key] = value;   
    }
});

console.log(consolidatedBanksNames)
debugger

export const getUniqueBanksInput = (data) => {
    const bankSet = new Set;
    for (let i = 0; i < data.length; i++) {
        if (data[i].underwriters === null) {
            let bank = null
            bankSet.add(bank);
        } else {
            let bankItems = (Object.keys(data[i].underwriters));
            for (let i = 1; i < bankItems.length; i++) {
                bankSet.add(bankItems[i]);
            }
        }
    }

    return bankSet;
}


export const getBanks = (bankInputSet) => {
    const banksArray = Array.from(bankInputSet)
    const banksOutput = []

    for (let i = 0; i < banksArray.length; i++) {
        let bankInput = banksArray[i]; 

        banksOutput.push(consolidatedBanksNames[bankInput]);
    }

    return banksOutput;
}
