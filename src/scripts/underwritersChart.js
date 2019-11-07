import { majorSectorGroups } from '../scripts/sectors'
import { capitalize } from './_helperFunctions'

export const leagueTable = (data, sector, company) => {
    if (sector === "undefined") {
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
    }
}