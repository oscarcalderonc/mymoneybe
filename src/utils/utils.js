module.exports.isEmpty = (word) => {
    return !word || word === null || word === undefined || word.trim() === '';
};

module.exports.mapDocuments = (snapshot) => {
    if (snapshot && !snapshot.empty) {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    return [];
};

module.exports.mapDocument = (snapshot) => {
    if (snapshot && !snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }

    return {};
};
