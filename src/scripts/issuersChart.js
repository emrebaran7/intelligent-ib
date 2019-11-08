import {stylizeString} from "./stylizeBankNames"

export const topIssuersTable = (data, bankInput, yearInput) => {
    let commissionPerIssuer = [];
    for (let i = 0; i < data.length; i++) {
        let underwriters = data[i].underwriters
        let company = data[i].company_name
        let totalCommission = data[i].underwriting_discount_and_commissions.total;
        let targetBankCommission;
        let year = data[i].date_filed.slice(0,4);
        if (underwriters[bankInput] !== undefined && underwriters[bankInput] !== "null" && year === yearInput) {
            let allotment = underwriters[bankInput].allotment
            targetBankCommission = totalCommission * allotment;
        }
        let pushable = {}
        pushable[company] = targetBankCommission;     
        commissionPerIssuer.push(pushable);
    }
    return comissionPerIssuer;
}