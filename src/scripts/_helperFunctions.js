import {stylizeString} from "./stylizeBankNames";



export const capitalize = (string) => {
    let arr = string.split(" ");
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] !== undefined) {
            let firstLetter = arr[i][0].toUpperCase();
            let remainder = arr[i].slice(1).toLowerCase();
            result.push(firstLetter + remainder);
        };
    };

    return result.join(" ");
}

export function getNonConsolidatedBanks(bankName) {
    const data = require("../../assets/data/processed/bank-name-consol.json")
    const consolidatedBanksNames = [];
    debugger
    for (const datum of data) {
        const row = datum;
        const key = row["input_name"];
        const value = (row["output_name"]);
        consolidatedBanksNames[key] = value;
    }
    const bankNamesArray = Object.entries(consolidatedBanksNames)
    const outputArray = []

    for (let i = 0; i < bankNamesArray.length; i++){
        if (bankNamesArray[i][1] === bankName){
            outputArray.push(bankNamesArray[i][0])
        }
    }

    return outputArray;
} 
