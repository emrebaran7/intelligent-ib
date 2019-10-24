import {getIpoFeesByYear} from "./scripts/issuance"
import './styles/index.scss';

const data = require('../assets/data/processed/new_data.json')

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('app').innerText = "Hello World!";
});

getIpoFeesByYear(data);







