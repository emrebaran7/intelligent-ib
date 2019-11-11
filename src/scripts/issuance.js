import { fetchSectorData } from './sectors';

export const getIpoFeesByYear = (data, year, bank, sector) => {
    const years = [parseInt(year) - 2, parseInt(year) - 1, parseInt(year)]

    if (bank === undefined){
        let ipoFeesPerDeal = [];
        const lookupCodes = []
        
        fetchSectorData().then(sectorData => {
            for (let i = 0; i < sectorData.length; i++) {
                if (Object.values(sectorData[i])[0] === sector) {
                    lookupCodes.push(Object.keys(sectorData[i])[0]);
                }
            }

            let ipoFeesByYear = {};
            for (let i = 0; i < years.length; i++) {
                let yearItem = years[i]
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
            
            return ipoFeesByYear;
        });
    }
}
