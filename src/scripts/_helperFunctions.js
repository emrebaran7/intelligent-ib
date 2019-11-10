export const capitalize = (string) => {
    let arr = string.split(" ");
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] !== undefined) {
            let firstLetter = arr[i][0].toUpperCase();
            let remainder = arr[i].slice(1).toLowerCase();
            result.push(firstLetter + remainder);
        };
    };

    return result.join(" ");
}

