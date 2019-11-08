require("babel-polyfill");
export const majorSectorGroups = new Array

d3.csv("assets/data/raw/SIC/major-groups.csv").then(function (data) {
    for (let i = 0; i < data.length; i++){
        majorSectorGroups.push(data[i].Description);
    }
});

// export const sectorDescriptionToCode = new Array;

// d3.csv("assets/data/raw/SIC/major-groups.csv").then(function (data) {
//     for (let i = 0; i < data.length; i++){
//         let pushable = {};
//         let description =  data[i]['Description']
//         pushable[description] = [data[i]['Major Group']][0]
//         sectorDescriptionToCode.push(pushable);
//     }
// });

export async function fetchSectorData() {
    const sectorDescriptionToCode = {}
    const data = await d3.csv("assets/data/raw/SIC/major-groups.csv")
    for (const datum of data) {
        const row = datum;
        const key = row["Description"];
        const value = row["Major Group"];
        sectorDescriptionToCode[key] = value;
    }
    return sectorDescriptionToCode
}

