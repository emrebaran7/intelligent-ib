import { getCompanies } from "./scripts/companies";
import { autocomplete } from "./scripts/autocomplete";
import { majorSectorGroups } from './scripts/sectors';
import { displayForm } from "./scripts/displayForm";
import { getIpoFeesByYear } from "./scripts/issuance";
import { initialBarChart } from "./scripts/initialBarChart";
import * as styles from './styles/index.scss';
import { getUniqueBanksInput } from "./scripts/banks";
import { getBanks } from "./scripts/banks";
import { leagueTable } from "./scripts/underwritersChart";

require("babel-polyfill");

//data
const data = require('../assets/data/processed/new_data.json')
// const dataset = Object.values((getIpoFeesByYear(data)));

//Search Bar for Companies
const companies = [...new Set(getCompanies(data))];
autocomplete(document.getElementById("myCompanyInput"), companies);

//Search Bar for Sectors
autocomplete(document.getElementById("mySectorInput"), majorSectorGroups);

//barchart
// initialBarChart(dataset);

//banknames
const uniqueBanksInput = getUniqueBanksInput(data); 
getBanks(uniqueBanksInput).then(banks => {
    autocomplete(document.getElementById("myBankInput"), banks);
})

// leaguetables
// process company based league table
document.getElementById("company-search-form").submit.addEventListener("click", function (event) {
    event.preventDefault();
    const data = require('../assets/data/processed/new_data.json');
    let company = document.getElementById("myCompanyInput").value;
    let lt = leagueTable(data, "undefined", company);
    let perrow = 2, 
        html =`<h2> ${company}'s Fees to Underwriters</h2><table><tr>`;
    
    for (let i = 0; i < lt.length; i++){
        html += "<td>" + (i+1) + "." + "</td>"
        html += "<td>" + Object.keys(lt[i]) + "</td>";
        html += "<td>" + "$ "+ Object.values(lt[i])[0].toFixed(1) + " m" + "</td>" + "</tr>";
        let next = i+1;
        if (next%perrow===0 && next!=lt.length){
            html += "</tr><tr>";
        }
    }
    html += "</tr></table>";
    document.getElementById("table-container").innerHTML = html;
});


//process Sector form data
document.getElementById("company-search-form").submit.addEventListener("click", function (event) {
    event.preventDefault();
    const data = require('../assets/data/processed/new_data.json');
    let sector = document.getElementById("mySectorInput").value
    leagueTable(data, sector, "undefined");


});

//process Bank form data
document.getElementById("company-search-form").submit.addEventListener("click", function () {
    let bank = document.getElementById("myBankInput").value
});