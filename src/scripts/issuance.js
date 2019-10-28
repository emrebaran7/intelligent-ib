
export const getIpoFeesByYear = (data) => {
    const ipoFeesPerDeal = new Array

    for (let i = 0; i < data.length; i++) {
        let year = data[i].date_filed.slice(0,4);
        let commission;

        if (data[i].underwriting_discount_and_commissions === null) {
            commission = 0;
        } else {
            commission = data[i].underwriting_discount_and_commissions.total;
        };

        if (commission === null) {
            commission = 0;
        };

        let commissionLineItem = { [year]: commission / 1000000 };
        ipoFeesPerDeal.push(commissionLineItem);
    };

    let ipoFeesByYear = {
        "2013": 0,
        "2014": 0,
        "2015": 0,
        "2016": 0,
        "2017": 0,
        "2018": 0,
        "2019": 0,
    }

    for (let y = 0; y < ipoFeesPerDeal.length ; y++) {
        
        let key = Object.keys(ipoFeesPerDeal[y])
        let value = parseInt(Object.values(ipoFeesPerDeal[y]));
        ipoFeesByYear[key] += value;
    };
    
    return ipoFeesByYear;
}

