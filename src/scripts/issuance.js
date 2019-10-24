import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

// function importData() {
//     d3.json("/assets/data/processed/data.json", function(data) {
//         console.log(data);
//     })
// }


export const getIpoFeesByYear = (data) => {
    const ipoFeesByYear = new Array

    for (let i = 0; i < data.length; i++) {
        let year = data[i].date_filed.slice(0,4);
        let commission;

        if (data[i].underwriting_discount_and_commissions === undefined) {
            commission = 0;
        } else {
            commission = data[i].underwriting_discount_and_commissions.total;
        };

        if (commission === null) {
            commission = 0;
        };

        let commissionLineItem = { [year]: commission / 1000000 };
        ipoFeesbyYear.push(commissionLineItem);
    };

    for (let y = 0; y < ipoFeesbyYear.length ; y++) {
        ipoFeesByYear[y]
    };
}

