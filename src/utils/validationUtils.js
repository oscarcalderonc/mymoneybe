module.exports.isEmpty = (word) => {
    return !word || word === null || word === undefined || word.trim() === '';
}