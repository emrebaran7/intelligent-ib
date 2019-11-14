
var d3 = require("d3");
var fs = require("fs");

async function getNonConsolidatedBanksforAll() {
    const consolidatedBanksNames = {}
    const data = await d3.csv("assets/data/raw/bank-name-consol.csv")
    for (const datum of data) {
        const row = datum;
        const key = row["input_name"];
        const value = (row["output_name"]);
        consolidatedBanksNames[key] = value;
    }
    const bankNamesArray = Object.entries(consolidatedBanksNames);

    const dict = {}
    for (let i = 0; i < bankNamesArray.length; i++) {
        let key2 = bankNamesArray[i][1]
        dict[key2] = [];
    }

    for (let i = 0; i < bankNamesArray.length; i++) {
        let key3 = bankNamesArray[i][1]
        let val3 = bankNamesArray[i][0]
        dict[key3].push(val3);
    }

    return dict;
}

getNonConsolidatedBanksforAll().then( obj => {
    fs.writeFile("/Users/emreersolmaz/Desktop/Intelligent-IB/assets/data/processed/consolidatedBankNameReversion.json", obj, (err) => {
        if (err) throw err;
        console.log('Succes')
    })
}
