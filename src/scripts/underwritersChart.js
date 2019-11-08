import { sectorDescriptionToCode } from '../scripts/sectors'
import { capitalize } from './_helperFunctions'
import { stylizeString, alphaNumerizer } from "./stylizeBankNames"

export const leagueTable = (data, lookupCode, company, yearInput) => {
    if (lookupCode === "undefined") {
        let comissionPerBank = [];
        for (let y = 0; y < data.length; y++) {
            let issuer = data[y].company_name;
            if (capitalize(issuer) === capitalize(company)) {
                let underwriters = data[y].underwriters;
                let totalCommission = data[y].underwriting_discount_and_commissions.total;
                let underwriter;
                for (underwriter in underwriters) {
                    let pushable = {};
                    pushable[underwriter] = (totalCommission * underwriters[underwriter].allotment / 1000000);
                    comissionPerBank.push(pushable);
                }
            } 
        }
        return comissionPerBank;
    } else if (company === "undefined"){
        let comissionPerBank = {};
        for (let z = 0; z < data.length; z++) {
            let industryCode = data[z].SIC.slice(0,2); 
            let commision = data[z].underwriting_discount_and_commissions;
            let year = data[z].date_filed.slice(0, 4)
            if (industryCode === lookupCode && commision !== null && yearInput === year ) {
                let underwriters = data[z].underwriters;
                let totalCommission = commision.total;
                let underwriter;
                for (underwriter in underwriters) {
                    let fixedUnderwriterName = stylizeString(underwriter);
                    if (comissionPerBank[underwriter] === undefined){
                        comissionPerBank[fixedUnderwriterName] = (totalCommission * underwriters[underwriter].allotment / 1000000);
                    } else {
                        comissionPerBank[fixedUnderwriterName] += (totalCommission * underwriters[underwriter].allotment / 1000000);
                    }
                }
            }
        }
        const comissionPerBankArray = [];
        for (let [key, value] of Object.entries(comissionPerBank)){
            let pushable = {}
            pushable[key] = value
            comissionPerBankArray.push(pushable)
        }
        
        comissionPerBankArray.sort((a,b) => {
            if (Object.values(a)[0] > Object.values(b)[0]){
                return -1;
            } else {
                return 1;
            }
        })
        return comissionPerBankArray
    }
}