// remove unicode and convert to ASCII
const removeUnicode = (string) => {
    if (string !== undefined) {
        let result = string.replace(/[^\x00-\x7F]/g, "").replace("\n"," ").replace(".",''); 
        return result;
    }
}

// fix ampersand spacing
const fixAmpersandSpacing = (string) => {
    let result = ""
    if (string !== null) {
        for (let i = 0; i < string.length; i++) {
            if (string[i] !== " " && string[i + 1] === "&") {
                result += (string[i] + " ");
            } else if (string[i] === "&" && string[i + 1] !== " ") {
                result += (string[i] + " ");
            } else {
                result += string[i];
            }
        }
        return result;
    }
}

// combine methods
export const stylizeString = (string) => {
    if (string !== null) {
        return removeUnicode(fixAmpersandSpacing(string.replace(/  +/g, ' ')));
    }
}

//alphanumerize string
const alphaNumerizer = (string) => {
    const alphanumeric = ('0123456789ABCDEFGHIJKLMOPQRSTUVWXYZ').split('');
    let result = '';

    for (let i = 0; i < string.length; i++) {
        if (alphanumeric.includes(string[i])) {
            result += string[i];
        }
    }

    return result
}