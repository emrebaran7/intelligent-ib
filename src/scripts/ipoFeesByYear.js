import { fetchSectorData } from './sectors';

export const getIpoFeesByYear = (data, year, bank, lookupCodes) => {
    const years = [parseInt(year) - 2, parseInt(year) - 1, parseInt(year)]

    if (bank === undefined){
        let ipoFeesPerDeal = [];
        let ipoFeesByYear = {};
        
        for (let i = 0; i < years.length; i++) {
            let yearItem = years[i];
            ipoFeesByYear[yearItem] = 0;
        }
    
        for (let i = 0; i < data.length; i++) {
            let year = parseInt(data[i].date_filed.slice(0,4));
            let sicCode = data[i].SIC;

            let commission = 0;
            if (data[i].underwriting_discount_and_commissions !== null && lookupCodes.includes(sicCode) && years.includes(year)) {
                commission = data[i].underwriting_discount_and_commissions.total;
                let commissionLineItem = { [year]: commission / 1000000 };
                ipoFeesPerDeal.push(commissionLineItem);
            }
        }
        
        for (let y = 0; y < ipoFeesPerDeal.length ; y++) {
            let key = Object.keys(ipoFeesPerDeal[y])
            let value = parseInt(Object.values(ipoFeesPerDeal[y]));
            ipoFeesByYear[key] += value;
        };     

        let ipoFeesByYearArray = []
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
}
