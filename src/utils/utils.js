
const { isEmpty, filter, isDate } = require('lodash');

module.exports.mapDocuments = (snapshot) => {
    if (snapshot && !snapshot.empty) {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    return [];
};

module.exports.mapDocument = (snapshot) => {
    if (snapshot && !snapshot.empty) {
        return { id: snapshot.id, ...snapshot.data() };
    }

    return {};
};

module.exports.addToFilter = (query) => (filterValue, filterName, filterCriteria = '==') => {

    if (!isEmpty(filterValue) || isDate(filterValue)) {
        return query.where(filterName, filterCriteria, filterValue);
    }

    return query;
};
