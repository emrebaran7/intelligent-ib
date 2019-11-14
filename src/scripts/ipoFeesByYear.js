import { fetchSectorData } from './sectors';
import { getNonConsolidatedBanks } from "./_helperFunctions"

export const getIpoFeesByYear = async (data, year, bank, sectorLookupCodes) => {
    const years = [parseInt(year) - 2, parseInt(year) - 1, parseInt(year)]
    let ipoFeesPerDeal = [];
    let ipoFeesByYear = {};
    let ipoFeesByYearArray = []
    
    //intitiate ipoFeesByyear object
    for (let i = 0; i < years.length; i++) {
        let yearItem = years[i];
        ipoFeesByYear[yearItem] = 0;
    }
    
    for (let i = 0; i < data.length; i++) {
        let year = parseInt(data[i].date_filed.slice(0,4));
        let sicCode = data[i].SIC;

        let underwriters = data[i].underwriters 
        let underwriterNames;
        if (underwriters !== null) {
            underwriterNames = Object.keys(data[i].underwriters)
        }
        
        let commission = 0;
        if (data[i].underwriting_discount_and_commissions !== null){
            commission = data[i].underwriting_discount_and_commissions.total;
        }

        if (bank === undefined){
            if (sectorLookupCodes.includes(sicCode) && years.includes(year)) {
                let commissionLineItem = { [year]: commission / 1000000 };
                ipoFeesPerDeal.push(commissionLineItem);
            }
        } else if (sectorLookupCodes === undefined){
            let bankLookupNames = await getNonConsolidatedBanks(bank); 

            for (let y = 0; y < bankLookupNames.length; y++){
                let lookupName = bankLookupNames[y];

                if (underwriterNames !== undefined && underwriterNames.includes(lookupName) && years.includes(year)){
                    let focusBankAllotment = underwriters[lookupName].allotment;
                    let focusBankCommission = commission * focusBankAllotment;
                    let commissionLineItem = { [year]: focusBankCommission / 1000000 };
                    ipoFeesPerDeal.push(commissionLineItem);
                }
            }
        }
    }

    //fill ipo fees per deal array
    for (let i = 0; i < ipoFeesPerDeal.length ; i++) {
        let key = Object.keys(ipoFeesPerDeal[i])
        let value = parseInt(Object.values(ipoFeesPerDeal[i]));
        ipoFeesByYear[key] += value;
    };

    
    for (let year in ipoFeesByYear){
        let value1 = year;
        let value2 = ipoFeesByYear[year];
        let pushable = {};
        pushable["year"] = value1;
        pushable["fees"] = value2;
        ipoFeesByYearArray.push(pushable)
    }

    return ipoFeesByYearArray;
}
