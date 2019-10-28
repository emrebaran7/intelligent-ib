// const bankRevenueAggragator()
const leagueTable = (dataset, sector, issuer) => {
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
                    let underwriterName = Object.keys(underwriters[i])[0];3
                    let bankCommission = allotment * totalCommission;
                    comissionPerBank[underwriterName] += bankCommission;
                }
            }
        }

        return comissionPerBank;
    }
}

export const getBanks = (data) => {
    const bankSet = new Set;
    for (let i = 0; i < data.length; i++ ) {
        if (data[i].underwriters === null) {
            let bank = null
            bankSet.add(bank);
        } else {
            let bankItems = (Object.keys(data[i].underwriters));
            for (let i = 1; i < bankItems.length; i++ ){
                bankSet.add(bankItems[i]);
            }   
        }
    }
    
    return bankSet;
}