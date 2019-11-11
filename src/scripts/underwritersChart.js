import { sectorDescriptionToCode } from '../scripts/sectors';
import { capitalize } from './_helperFunctions';
import { fetchData } from './banks';
import { stylizeString, alphaNumerizer } from "./stylizeBankNames";

export const leagueTable = async (data, lookupCodes, company, yearInput) => {
    const consolidatedBanksNames = await fetchData();

    if (lookupCodes === "undefined") {
        let commissionPerBank = [];
        for (let y = 0; y < data.length; y++) {
            let issuer = data[y].company_name;
            if (capitalize(issuer) === capitalize(company)) {
                let underwriters = data[y].underwriters;
                let totalCommission = data[y].underwriting_discount_and_commissions.total;
                let underwriter;
                for (underwriter in underwriters) {
                    let pushable = {};
                    let stylizedUnderwriter = consolidatedBanksNames[underwriter];
                    pushable[stylizedUnderwriter] = (totalCommission * underwriters[underwriter].allotment / 1000000);
                    commissionPerBank.push(pushable);
                }
            }
        }
        
        return commissionPerBank;
    } else if (company === "undefined"){
        let commissionPerBank = {};
        for (let z = 0; z < data.length; z++) {
            let sicCode = data[z].SIC; 
            let commission = data[z].underwriting_discount_and_commissions;
            let year = data[z].date_filed.slice(0, 4)
            let underwriters = data[z].underwriters;
            if (lookupCodes.includes(sicCode) && commission !== null && yearInput === year && underwriters !== null ) {
                let totalCommission = commission.total;
                for (let underwriter in underwriters) { 
                    let stylizedUnderwriter = consolidatedBanksNames[underwriter];
                    if (commissionPerBank[underwriter] === undefined){
                        commissionPerBank[stylizedUnderwriter] = (totalCommission * underwriters[underwriter].allotment / 1000000);
                    } else {
                        commissionPerBank[stylizedUnderwriter] += (totalCommission * underwriters[underwriter].allotment / 1000000);
                    }
                }
            }
        }
        if (commissionPerBank !== {}){
            const commissionPerBankArray = [];
            for (let [key, value] of Object.entries(commissionPerBank)){
                let pushable = {}
                pushable[key] = value
                commissionPerBankArray.push(pushable)
            }
            
            commissionPerBankArray.sort((a,b) => {
                if (Object.values(a)[0] > Object.values(b)[0]){
                    return -1;
                } else {
                    return 1;
                }
            })
            return commissionPerBankArray
        }
    }
}