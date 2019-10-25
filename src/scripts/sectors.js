export const majorSectorGroups = new Array

d3.csv("assets/data/raw/SIC/major-groups.csv").then(function (data) {
    for (let i = 0; i < data.length; i++){
        majorSectorGroups.push(data[i].Description);
    }
});
