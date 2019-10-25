import { getIpoFeesByYear} from "./scripts/issuance";
import { getCompanies } from "./scripts/companies";
import { autocomplete } from "./scripts/autocomplete";
import './styles/index.scss';

//data
const data = require('../assets/data/processed/new_data.json')
const dataset = Object.values((getIpoFeesByYear(data)));

//Search Bar for Companies
const companies = [...new Set(getCompanies(data))];
autocomplete(document.getElementById("myCompanyInput"), companies);

//Search Bar for Companies
const sectors = [...new Set(getCompanies(data))];
autocomplete(document.getElementById("mySectorInput"), sectors);

// initial bar chart
const svgWidth = 500, svgHeight = 300, barPadding = 5;
const barWidth = (svgWidth / dataset.length);

const svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const barChart = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", function (d) {
        return svgHeight - d/20
    })
    .attr("height", function (d) {
        return d;
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0];
        return "translate(" + translate + ")";
    });

