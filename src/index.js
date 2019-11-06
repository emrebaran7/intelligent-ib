import { getCompanies } from "./scripts/companies";
import { autocomplete } from "./scripts/autocomplete";
import { majorSectorGroups } from './scripts/sectors';
import { displayForm } from "./scripts/displayForm";
import { getIpoFeesByYear } from "./scripts/issuance";
import { initialBarChart } from "./scripts/initialBarChart";
import * as styles from './styles/index.scss';
import { getUniqueBanksInput } from "./scripts/banks";
import { getBanks } from "./scripts/banks";
import { leagueTable } from "./scripts/underwritersChart"

require("babel-polyfill");

//data
const data = require('../assets/data/processed/new_data.json')
const dataset = Object.values((getIpoFeesByYear(data)));

//Search Bar for Companies
const companies = [...new Set(getCompanies(data))];
autocomplete(document.getElementById("myCompanyInput"), companies);

//Search Bar for Sectors
autocomplete(document.getElementById("mySectorInput"), majorSectorGroups);

//barchart
initialBarChart(dataset);

//banknames
const uniqueBanksInput = getUniqueBanksInput(data); 
getBanks(uniqueBanksInput).then(banks => {
    autocomplete(document.getElementById("myBankInput"), banks);
})

//process Company form data
document.getElementById("company-search-form").submit.addEventListener("click", function () {
    let company = document.getElementById("myCompanyInput").value
    leagueTable(dataset, undefined, company);
});

//process Sector form data
document.getElementById("company-search-form").submit.addEventListener("click", function () {
    let sector = document.getElementById("mySectorInput").value
    leagueTable(dataset, sector, undefined);
});

//process Bank form data
document.getElementById("company-search-form").submit.addEventListener("click", function () {
    let bank = document.getElementById("myBankInput").value

});