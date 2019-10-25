function displayForm(c) {
    if (c.currentTarget.value === "sector") {
        document.getElementById("company-search-form").style.visibility = 'hidden';
        document.getElementById("sector-search-form").style.visibility = 'visible';
    } else if (c.currentTarget.value === "issuer") {
        document.getElementById("company-search-form").style.visibility = 'visible';
        document.getElementById("sector-search-form").style.visibility = 'hidden';
    } else {}
} 

const analysisTypes = document.getElementsByName("analysis-type")

for (let i = 0; i < analysisTypes.length; i++) {
    analysisTypes[i].addEventListener("click", displayForm);
}
