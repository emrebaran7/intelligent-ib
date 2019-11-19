import {stylizeString} from "./stylizeBankNames";
import {fetchData} from './banks';
import {capitalize} from "./_helperFunctions";
require("babel-polyfill");

export const topIssuersTable = async (data, bankInput, yearInput) => {3
    const commissionPerIssuer = [];
    const consolidatedBanksNames = await fetchData();

    for (let i = 0; i < data.length; i++) {
        let underwriters = data[i].underwriters;
        let year = data[i].date_filed.slice(0,4);
        let company = data[i].company_name;
        let commissionData = data[i].underwriting_discount_and_commissions;

        if (underwriters !== null && underwriters !== undefined && year === yearInput) {  
            let stylizedUnderwritersAllot = {};
            let underwritersKeys = Object.keys(underwriters);
            
            //stylized allotment table, matches
            for (let z = 0; z < underwritersKeys.length; z++) {
                let bankName = underwritersKeys[z];
                let allot = underwriters[bankName].allotment;
                let stylizedBankName = consolidatedBanksNames[bankName]
                stylizedUnderwritersAllot[stylizedBankName] = allot;
            }
            
            if (commissionData !== null){
                let totalCommission = commissionData.total;

                if (stylizedUnderwritersAllot[bankInput] !== undefined){
                    let allotment = stylizedUnderwritersAllot[bankInput];
                    let targetBankCommission = totalCommission * allotment / 1000000;
                    let pushable = {}
                    pushable[capitalize(company)] = targetBankCommission;     
                    commissionPerIssuer.push(pushable);
                }
            }        
        }
    }

    commissionPerIssuer.sort((a, b) => {
        if (Object.values(a)[0] > Object.values(b)[0]) {
            return -1;
        } else {
            return 1;
        }
    })
    return commissionPerIssuer;
}
