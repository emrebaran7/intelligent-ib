// remove unicode and convert to ASCII
const removeUnicode = (string) => {
    if (string !== undefined) {
        let result = string.replace(/[^\x00-\x7F]/g, "").replace("\n","");
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
    return removeUnicode(fixAmpersandSpacing(string));
}