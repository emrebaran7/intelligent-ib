function displayForm(c) {
    if (c.currentTarget.value === "sector") {
        document.getElementById("company-search-form").style.visibility = 'hidden';
        document.getElementById("sector-search-form").style.visibility = 'visible';
        document.getElementById("bank-search-form").style.visibility = 'hidden';
    } else if (c.currentTarget.value === "issuer") {
        document.getElementById("company-search-form").style.visibility = 'visible';
        document.getElementById("sector-search-form").style.visibility = 'hidden';
        document.getElementById("bank-search-form").style.visibility = 'hidden';
    } else if (c.currentTarget.value === "bank") {
        document.getElementById("company-search-form").style.visibility = 'hidden';
        document.getElementById("sector-search-form").style.visibility = 'hidden';
        document.getElementById("bank-search-form").style.visibility = 'visible';        
    }
} 

const analysisTypes = document.getElementsByName("analysis-type")

for (let i = 0; i < analysisTypes.length; i++) {
    analysisTypes[i].addEventListener("click", displayForm);
}
