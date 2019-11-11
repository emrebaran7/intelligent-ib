require("babel-polyfill");

export const majorSectorGroups = new Array;

d3.csv("assets/data/raw/SIC/SIC to NAICS.csv").then(function (data) {
    for (let i = 0; i < data.length; i++){
        if (!(majorSectorGroups.includes(data[i].Industry))){
            majorSectorGroups.push(data[i].Industry);
        }
    }
});

export async function fetchSectorData() {
    const sicCodesToIndustry = []
    const data = await d3.csv("assets/data/raw/SIC/SIC to NAICS.csv")
    for (const datum of data) {
        const row = datum;
        const key = row["SIC Code"];
        const value = row["Industry"];
        let pushable = {};
        pushable[key] = value;
        sicCodesToIndustry.push(pushable)
    }
    return sicCodesToIndustry
}

