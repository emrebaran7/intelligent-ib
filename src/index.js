import { getCompanies } from "./scripts/companies";
import { autocomplete } from "./scripts/autocomplete";
import { majorSectorGroups, fetchSectorData } from './scripts/sectors';
import { getIpoFeesByYear } from "./scripts/ipoFeesByYear";
import { initialBarChart } from "./scripts/initialBarChart";
import * as styles from './styles/index.scss';
import { getUniqueBanksInput } from "./scripts/banks";
import { getBanks } from "./scripts/banks";
import { leagueTable } from "./scripts/underwritersChart";
import { topIssuersTable } from "./scripts/issuersChart";
import { yearlyGrowthChart } from "./scripts/yearlyGrowthChart";
import { getMissingBanks} from "./scripts/temp"
require("babel-polyfill");
 
//data
const data = require('../assets/data/processed/new_data.json')
// console.log(getMissingBanks(data)); 

//relevant containers
let radioForm = document.getElementById("analysis-type-selector");
let barChartContainer = document.getElementById("bar-chart");
let tableContainer = document.getElementById("table-container");
let yearSelector = document.getElementById("year-selector");
let yearSelection = document.getElementById("year-selection");
let analyticsContainer = document.getElementById("analytics-container");
let searchBarHeader = document.getElementById("search-bar-header");
let searchBarContainer = document.getElementById("search-bar-container");
let mySearchInput = document.getElementById("my-search-input");
let searchForm = document.getElementById("search-form");

// common helper elements
let tableLength = 10; 

// reset when clicked on year
yearSelection.onclick = function() {
    barChartContainer.innerHTML = "";
    tableContainer.innerHTML = "";
    analyticsContainer.style.visibility = "hidden"
    tableContainer.style.visibility = "hidden"
}

// search-bars
for (let i = 0; i < radioForm.length; i++) {
    let currentRadio = radioForm[i];

    currentRadio.onclick = function() {
        searchBarHeader.innerHTML = `Enter ${ this.value }:`;
        searchBarContainer.style.visibility = 'visible';
        analyticsContainer.style.visibility = "hidden";
        tableContainer.style.visibility = "hidden";
        
        //yearSelector visibility
        if (this.value === "Sector" || this.value === "Bank") {
            yearSelector.style.visibility = 'visible';
        } else {yearSelector.style.visibility = 'hidden'}

        if (barChartContainer !== undefined && barChartContainer !== null){
            barChartContainer.innerHTML = "";
            tableContainer.innerHTML = "";
        }

        //searchbars
        if (currentRadio.value === 'Sector') { 
            mySearchInput.placeholder = `Enter ${this.value}` 
            autocomplete(document.getElementById("my-search-input"), majorSectorGroups);     
            

            // when you click on the search bar you should see all options
            mySearchInput.addEventListener("click", function(event) {
                let sectorList = document.getElementById("onclick-sector-name-list");
                sectorList.innerHTML = "";
                for (let i = 0; i < majorSectorGroups.length; i++) {
                    let node = document.createElement("DIV");
                    let textnode = document.createTextNode(majorSectorGroups[i]);
                    node.appendChild(textnode);
                    sectorList.appendChild(node)
                    node.setAttribute("class", 'sector-items')

                    // enables selection in dropdown
                    node.addEventListener('click', function(event) {
                        mySearchInput.value = textnode.wholeText;
                        sectorList.innerHTML = "";
                        
                    })

                    mySearchInput.addEventListener('keydown', function (event) {
                        if (event.key === "Escape") {
                            sectorList.innerHTML = "";
                        }
                    })

                }   
                
                function closeAllLists(elmnt) {
                    let sectorItems = document.getElementsByClassName("sector-items");
                    for (let i = 0; i < sectorItems.length; i++) {
                        sectorItems[i].parentNode.removeChild(sectorItems[i]);
                    }
                }

                // document.addEventListener("click", function (e) {
                //     debugger
                //     closeAllLists(e.target);
                // });
            })
            
            //clear when type
            mySearchInput.addEventListener("input", function(event){
                let sectorList = document.getElementById("onclick-sector-name-list");

                sectorList.innerHTML = ""
            })


        } else if (this.value === 'Bank') { 
            mySearchInput.placeholder = `Enter ${this.value} Name` ;
            const uniqueBanksInput = getUniqueBanksInput(data); 
            getBanks(uniqueBanksInput).then(banks => {
                autocomplete(document.getElementById("my-search-input"), banks);
            })
        } else if (this.value === 'Issuer') { 
            mySearchInput.placeholder = `Enter ${this.value} Name` 
            const companies = [...new Set(getCompanies(data))];
            autocomplete(document.getElementById("my-search-input"), companies);
        }
    }
}

searchForm.submit.addEventListener("click", async function (event) {
    event.preventDefault();
    if (barChartContainer !== undefined && barChartContainer !== null) {
        barChartContainer.innerHTML = "";
        tableContainer.innerHTML = "";
    }

    let year = yearSelection.value
    
    let selectedRadio; 
    for (let i = 0; i < radioForm.length; i++) {
        if (radioForm[i].checked){
            selectedRadio = radioForm[i].value
        }
    }
    
    if (selectedRadio === "Sector"){
        let sector = mySearchInput.value;
        //process sector based league table
        let sectorData = await fetchSectorData();

        //get lookup codes to input league table
        const lookupCodes = [];
        for (let i = 0; i < sectorData.length; i++) {
            if (Object.values(sectorData[i])[0] === sector) {
                lookupCodes.push(Object.keys(sectorData[i])[0]);
            }
        }

        //table
        let lt = await leagueTable(data, lookupCodes, "undefined", year);
        if (lt.length < 10) {tableLength = lt.length}
        
        let html = `<h2>${year} Fees to Top ${tableLength} Underwriters in ${sector}</h2><table><tr>`;
        html += createTable(lt);
        tableContainer.style.visibility = "visible"
        tableContainer.innerHTML = html;

        //barchart
        analyticsContainer.style.visibility = "visible"
        let ipoFeesByYear = getIpoFeesByYear(data, year, undefined, lookupCodes);
        yearlyGrowthChart(ipoFeesByYear);

    } else if (selectedRadio === 'Bank') {
        //process bank form data
        let bank = mySearchInput.value;

        //table
        let topIssuers = await topIssuersTable(data, bank, year); 
        debugger
        if (topIssuers.length < 10) { tableLength = topIssuers.length }

        let html = `<h2>${bank}'s Top ${tableLength} Fee-Payers in ${year}</h2><table><tr>`;
        html += createTable(topIssuers)
        tableContainer.style.visibility = "visible"
        tableContainer.innerHTML = html;

        //barchart
        analyticsContainer.style.visibility = "visible"
        let ipoFeesByYear = getIpoFeesByYear(data, year, bank, undefined);
        yearlyGrowthChart(ipoFeesByYear);

    } else if (selectedRadio === 'Issuer') {
        //process issuer based league table
        let company = document.getElementById("my-search-input").value;
        
        //table
        let lt = await leagueTable(data, "undefined", company, year);
        if (lt.length < 10) { tableLength = lt.length }

        let html = `<h2> ${company}'s Top ${tableLength} IPO Underwriters</h2><table><tr>`;
        html += createTable(lt);
        tableContainer.style.visibility = "visible"
        tableContainer.innerHTML = html;
    };
}); 

function createTable(inputTable) {
    let tableLength = inputTable.length;
    if (inputTable.length > 10) { tableLength = 10 }

    let perrow = 3,
        html = ""

    for (let i = 0; i < tableLength; i++) {
        html += "<td>" + (i + 1) + "." + "</td>"
        html += "<td>" + Object.keys(inputTable[i]) + "</td>";
        html += "<td>" + "$ " + Object.values(inputTable[i])[0].toFixed(1) + " m" + "</td>" + "</tr>";
        let next = i + 1;
        if (next % perrow === 0 && next !== inputTable.length) {
            html += "</tr><tr>";
        }
    }
    html += "</tr></table>";

    return html;
}