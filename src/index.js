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
import { topIssuersTable } from "./scripts/issuersChart"
import { yearlyGrowthChart } from "./scripts/yearlyGrowthChart"
require("babel-polyfill");

//data
const data = require('../assets/data/processed/new_data.json')

const radioForm = document.getElementById("analysis-type-selector")

// search-bars
for (let radio in radioForm) {
    let currentRadio = radioForm[radio];

    currentRadio.onclick = function(event) {
        document.getElementById("search-bar-header").innerHTML = `Enter ${ this.value }:`

        if (this.value === 'Sector') {
            document.getElementById("my-search-input").placeholder = `${this.value}`
            autocomplete(document.getElementById("my-search-input"), majorSectorGroups);

            //process sector based league table
            document.getElementById("search-form").submit.addEventListener("click", function (event) {
                event.preventDefault();
                fetchSectorData().then(async sectorData => {
                    let year = document.getElementById("year-selection").value
                    let sector = document.getElementById("my-search-input").value;
                    const data = require('../assets/data/processed/new_data.json');

                    const lookupCodes = [];
                    for (let i = 0; i < sectorData.length; i++) {
                        if (Object.values(sectorData[i])[0] === sector) {
                            lookupCodes.push(Object.keys(sectorData[i])[0])
                        }
                    }

                    let lt = await leagueTable(data, lookupCodes, "undefined", year);
                    let perrow = 3,
                        html = `<h2>${year} Fees to Underwriters in ${sector}</h2><table><tr>`;
                    for (let i = 0; i < 20; i++) {
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
                    let ipoFeesByYear = await getIpoFeesByYear(data, year, undefined, lookupCodes);
                    yearlyGrowthChart(ipoFeesByYear);
                });
            });
        } else if (this.value === 'Issuer') {
            document.getElementById("my-search-input").placeholder = `${this.value} name`
            const companies = [...new Set(getCompanies(data))];
            autocomplete(document.getElementById("my-search-input"), companies);

            //process sector based league table
            document.getElementById("search-form").submit.addEventListener("click", async function (event) {
                event.preventDefault();
                debugger
                const data = require('../assets/data/processed/new_data.json');
                let company = document.getElementById("my-search-input").value;
                let yearInput = document.getElementById("year-selection").value;

                let lt = await leagueTable(data, "undefined", company, yearInput);
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

        } else if (this.value === 'Bank') {
            document.getElementById("my-search-input").placeholder = `${this.value} name`
            const uniqueBanksInput = getUniqueBanksInput(data); 
            getBanks(uniqueBanksInput).then(banks => {
                autocomplete(document.getElementById("my-search-input"), banks);
            })
            
            //process Bank form data
            document.getElementById("search-form").submit.addEventListener("click", async function (event) {
                event.preventDefault();

                const data = require('../assets/data/processed/new_data.json');
                const bankInput = document.getElementById("my-search-input").value;
                const yearInput = document.getElementById("year-selection").value;

                const topIssuers = await topIssuersTable(data, bankInput, yearInput);
                let tableLength = topIssuers.length;
                if (topIssuers.length > 20) { tableLength = 20 }
                let perrow = 3,
                    html = `<h2>${bankInput}'s Top 20 Fee-Payers in ${yearInput}</h2><table><tr>`;

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
            });
        }
    }
}

// barchart for banks
// document.getElementById("bank-search-form").submit.addEventListener("click", function (event) {
//     event.preventDefault();
//     let year = document.getElementById("year-selection").value;
//     let sector = document.getElementById("my-sector-input").value;
//     const data = require('../assets/data/processed/new_data.json');

//     const lookupCodes = [];
//     for (let i = 0; i < sectorData.length; i++) {
//         if (Object.values(sectorData[i])[0] === sector) {
//             lookupCodes.push(Object.keys(sectorData[i])[0])
//         }
//     }
//     let ipoFeesByYear = Object.values(await getIpoFeesByYear(data, year, undefined, lookupCodes));
//     initialBarChart(ipoFeesByYear);
// });


