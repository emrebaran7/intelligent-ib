import { getCompanies } from "./scripts/companies";
import { autocomplete } from "./scripts/autocomplete";
import { majorSectorGroups } from './scripts/sectors';
import { displayForm } from "./scripts/displayForm";
import { getIpoFeesByYear } from "./scripts/issuance";
import { initialBarChart } from "./scripts/initialBarChart";
import * as styles from './styles/index.scss';
import { getUniqueBanksInput, getBanks } from "./scripts/banks";


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
const banks = getBanks(getUniqueBanksInput(data));
autocomplete(document.getElementById("myBankInput"), banks);



