import { getCompanies } from "./scripts/companies";
import { autocomplete } from "./scripts/autocomplete";
import { majorSectorGroups } from './scripts/sectors';
import { displayForm } from "./scripts/displayForm";
import { getIpoFeesByYear } from "./scripts/issuance";
import { initialBarChart } from "./scripts/initialBarChart";
import './styles/index.scss';

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