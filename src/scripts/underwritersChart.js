import { majorSectorGroups } from '../scripts/sectors'

export const leagueTable = (dataset, sector, issuer) => {
    if (sector === "undefined" && issuer === "undefined") {
        for (let i = 0; i < dataset.legth; i++) {
            let underwriters = dataset[i].underwriters;
            let totalCommission = dataset[i].underwriting_discount_and_commissions.total;
            const comissionPerBank = {};
            
            // in case our parsing failed
            if (dataset[i].underwriting_discount_and_commissions === null) {
                comissionPerBank["Not Applicable"] += 0;
            } else {
                //underwriting comissions per bank 
                for (let i = 0; i < underwriters.length; i++) {
                    let allotment = underwriters[i].allotment;
                    let underwriterName = Object.keys(underwriters[i])[0];
                    let bankCommission = allotment * totalCommission;
                    comissionPerBank[underwriterName] += bankCommission;
                }
            }
        }
        return comissionPerBank;
    // for issuers
    } else if (sector === "undefined") {
        
    }
}

