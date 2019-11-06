import {capitalize} from "./_helperFunctions"

export const getCompanies = (data) => {
    const companies = new Array;

    for (let i = 0; i < data.length; i++){
        let company = capitalize(data[i].company_name);
        companies.push(company);
    }

    return companies;
}