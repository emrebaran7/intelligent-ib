import { getCompanies } from "./scripts/companies";
import { autocomplete } from "./scripts/autocomplete";
import { majorSectorGroups, fetchSectorData } from './scripts/sectors';
import { displayForm } from "./scripts/displayForm";
import { getIpoFeesByYear } from "./scripts/ipoFeesByYear";
import { initialBarChart } from "./scripts/initialBarChart";
import * as styles from './styles/index.scss';
import { getUniqueBanksInput } from "./scripts/banks";
import { getBanks } from "./scripts/banks";
import { leagueTable } from "./scripts/underwritersChart";
import { topIssuersTable } from "./scripts/issuersChart";
import { yearlyGrowthChart } from "./scripts/yearlyGrowthChart";
require("babel-polyfill");

//data
const data = require('../assets/data/processed/new_data.json')
const radioForm = document.getElementById("analysis-type-selector")

// search-bars
let barChartContainer = document.getElementById("bar-chart");
let tableContainer = document.getElementById("table-container");
let yearSelector = document.getElementById("year-selection");

yearSelector.onclick = function(event) {
    barChartContainer.innerHTML = "";
    tableContainer.innerHTML = "";
    tableContainer.style.visibility = "hidden"
    document.getElementById("analytics-container").style.visibility = "hidden"
}

for (let radio in radioForm) {
    let currentRadio = radioForm[radio];

    currentRadio.onclick = function(event) {
        document.getElementById("search-bar-header").innerHTML = `Enter ${ this.value }:`
        document.getElementById("year-selector").style.visibility = 'visible';
        document.getElementById("search-bar-container").style.visibility = 'visible';
        tableContainer.style.visibility = "hidden";
        document.getElementById("analytics-container").style.visibility = "hidden"


        if (barChartContainer !== undefined && barChartContainer !== null){
            barChartContainer.innerHTML = "";
            tableContainer.innerHTML = "";
            tableContainer.style = null
            document.getElementById("my-search-input").placeholder = `${this.value}`
        }

        if (this.value === 'Sector') {
            document.getElementById("my-search-input").placeholder = `${this.value}`
            autocomplete(document.getElementById("my-search-input"), majorSectorGroups);
            
            //process sector based league table
            document.getElementById("search-form").submit.addEventListener("click", function (event) {
                barChartContainer.innerHTML = "";
                tableContainer.innerHTML = "";
                let year = document.getElementById("year-selection").value
                event.preventDefault();
                fetchSectorData().then(async sectorData => {
                    let sector = document.getElementById("my-search-input").value;

                    const lookupCodes = [];
                    for (let i = 0; i < sectorData.length; i++) {
                        if (Object.values(sectorData[i])[0] === sector) {
                            lookupCodes.push(Object.keys(sectorData[i])[0])
                        }
                    }
                    let lt = await leagueTable(data, lookupCodes, "undefined", year);
                    let tableLength = lt.length;
                    if (lt.length > 10) { tableLength = 10 }

                    let perrow = 3,
                        html = `<h2>${year} Fees to Top ${tableLength} Underwriters in ${sector}</h2><table><tr>`;
                    for (let i = 0; i < tableLength; i++) {
                        html += "<td>" + (i + 1) + "." + "</td>"
                        html += "<td>" + Object.keys(lt[i]) + "</td>";
                        html += "<td>" + "$ " + Object.values(lt[i])[0].toFixed(1) + " m" + "</td>" + "</tr>";
                        let next = i + 1;
                        if (next % perrow === 0 && next !== lt.length) {
                            html += "</tr><tr>";
                        }
                    }
                    html += "</tr></table>";
                    document.getElementById("table-container").innerHTML = html;

                    //barchart
                    document.getElementById("analytics-container").style.visibility = "visible"
                    let ipoFeesByYear = getIpoFeesByYear(data, year, undefined, lookupCodes);
                    yearlyGrowthChart(ipoFeesByYear);
                });
            });
        } else if (this.value === 'Bank') {
            document.getElementById("my-search-input").placeholder = `${this.value} name`
            if (barChartContainer !== undefined && barChartContainer !== null) {
                barChartContainer.innerHTML = "";
                tableContainer.innerHTML = "";
                tableContainer.style = null
                document.getElementById("my-search-input").placeholder = `${this.value}`
            }
            const uniqueBanksInput = getUniqueBanksInput(data); 
            getBanks(uniqueBanksInput).then(banks => {
                autocomplete(document.getElementById("my-search-input"), banks);
            })
            //process Bank form data
            document.getElementById("search-form").submit.addEventListener("click", async function (event) {
                event.preventDefault();
                barChartContainer.innerHTML = "";
                tableContainer.innerHTML = "";

                let year = document.getElementById("year-selection").value
                let bank = document.getElementById("my-search-input").value;
                let topIssuers = await topIssuersTable(data, bank, year);
                let tableLength = topIssuers.length;
                if (topIssuers.length > 10) { tableLength = 10 }
                let perrow = 3,
                    html = `<h2>${bank}'s Top ${tableLength} Fee-Payers in ${year}</h2><table><tr>`;

                for (let i = 0; i < tableLength; i++) {
                    html += "<td>" + (i + 1) + "." + "</td>"
                    html += "<td>" + Object.keys(topIssuers[i])[0] + "</td>";
                    html += "<td>" + "$ " + Object.values(topIssuers[i])[0].toFixed(1) + " m" + "</td>" + "</tr>";
                    let next = i + 1;
                    if (next % perrow === 0 && next !== topIssuers.length) {
                        html += "</tr><tr>";
                    }
                }
                html += "</tr></table>";
                document.getElementById("table-container").innerHTML = html;

                //barchart
                document.getElementById("analytics-container").style.visibility = "visible"
                let ipoFeesByYear = getIpoFeesByYear(data, year, bank, undefined);
                debugger
                yearlyGrowthChart(ipoFeesByYear);
            });
        } else if (this.value === 'Issuer') {
            document.getElementById("my-search-input").placeholder = `${this.value} name`
            const companies = [...new Set(getCompanies(data))];
            autocomplete(document.getElementById("my-search-input"), companies);

            //process sector based league table
            document.getElementById("search-form").submit.addEventListener("click", async function (event) {
                document.getElementById("analytics-container").innerHTML = "";
                event.preventDefault();
                const company = document.getElementById("my-search-input").value;

                let lt = await leagueTable(data, "undefined", company, year);
                let perrow = 3,
                    html = `<h2> ${company}'s Fees to Underwriters</h2><table><tr>`;
                for (let i = 0; i < lt.length; i++) {
                    html += "<td>" + (i + 1) + "." + "</td>"
                    html += "<td>" + Object.keys(lt[i]) + "</td>";
                    html += "<td>" + "$ " + Object.values(lt[i])[0].toFixed(1) + " m" + "</td>" + "</tr>";
                    let next = i + 1;
                    if (next % perrow === 0 && next !== lt.length) {
                        html += "</tr><tr>";
                    }
                }
                html += "</tr></table>";
                document.getElementById("table-container").innerHTML = html;
            });

        } 
    }
}

