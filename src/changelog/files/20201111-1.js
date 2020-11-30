module.exports = async (db) => {
    const accountTypes = db.collection('accountTypes');

    // obj.id to get the id
    const savings = await accountTypes.add({
        cash: false,
        creditCard: false,
        loan: false,
        name: 'Savings Account',
        readOnly: true,
    });

    const cash = await accountTypes.add({
        cash: true,
        creditCard: false,
        loan: false,
        name: 'Cash',
        readOnly: true,
    });

    const creditCard = await accountTypes.add({
        cash: false,
        creditCard: false,
        loan: false,
        name: 'Credit Card',
        readOnly: true,
    });

    const banks = db.collection('banks');

    const bancoAgricola = await banks.add({
        name: 'Banco Agricola',
        acronym: 'BA',
    });

    const bancoCuscatlan = await banks.add({
        name: 'Banco Cuscatlan',
        acronym: 'CITI',
    });

    const payoneer = await banks.add({
        name: 'Payoneer',
        acronym: 'PYN',
    });

    const categories = db.collection('categories');

    await categories.add({ name: 'Adjustment', type: '-' });
    await categories.add({ name: 'Bills and Taxes', type: '-' });
    await categories.add({ name: 'Clothing', type: '-' });
    await categories.add({ name: 'Donations', type: '-' });
    await categories.add({ name: 'Education', type: '-' });
    await categories.add({ name: 'Family', type: '-' });
    await categories.add({ name: 'Food', type: '-' });
    await categories.add({ name: 'Freelancing', type: '-' });
    await categories.add({ name: 'Tools', type: '-' });
    await categories.add({ name: 'Health', type: '-' });
    await categories.add({ name: 'Household', type: '-' });
    await categories.add({ name: 'Leisure', type: '-' });
    await categories.add({ name: 'Loan', type: '-' });
    await categories.add({ name: 'Transportation', type: '-' });
    await categories.add({ name: 'Unexpected', type: '-' });
    await categories.add({ name: 'Salary', type: '+' });
    await categories.add({ name: 'Sales', type: '+' });

    const tags = db.collection('tags');

    await tags.add({ name: 'dad' });
    await tags.add({ name: 'mom' });
    await tags.add({ name: 'bills' });
    await tags.add({ name: 'taxes' });
    await tags.add({ name: 'articles' });
    await tags.add({ name: 'bank' });
    await tags.add({ name: 'beach' });
    await tags.add({ name: 'candies' });
    await tags.add({ name: 'car' });
    await tags.add({ name: 'cashback' });
    await tags.add({ name: 'cellphone' });
    await tags.add({ name: 'church' });
    await tags.add({ name: 'cine' });
    await tags.add({ name: 'clothing' });
    await tags.add({ name: 'coupon' });
    await tags.add({ name: 'course' });
    await tags.add({ name: 'creditcard' });
    await tags.add({ name: 'diezmo' });
    await tags.add({ name: 'drone' });
    await tags.add({ name: 'electricity' });
    await tags.add({ name: 'flight' });
    await tags.add({ name: 'food' });
    await tags.add({ name: 'freelancer' });
    await tags.add({ name: 'friends' });
    await tags.add({ name: 'gadget' });
    await tags.add({ name: 'games' });
    await tags.add({ name: 'gas' });
    await tags.add({ name: 'gearbest' });
    await tags.add({ name: 'getcash' });
    await tags.add({ name: 'gift' });
    await tags.add({ name: 'groceries' });
    await tags.add({ name: 'hosting' });
    await tags.add({ name: 'kindle' });
    await tags.add({ name: 'license' });
    await tags.add({ name: 'love' });
    await tags.add({ name: 'mail' });
    await tags.add({ name: 'massage' });
    await tags.add({ name: 'master' });
    await tags.add({ name: 'outsourcing' });
    await tags.add({ name: 'papajohns' });
    await tags.add({ name: 'parents' });
    await tags.add({ name: 'paycard' });
    await tags.add({ name: 'pet' });
    await tags.add({ name: 'pizzahut' });
    await tags.add({ name: 'pool' });
    await tags.add({ name: 'repairs' });
    await tags.add({ name: 'running' });
    await tags.add({ name: 'salary' });
    await tags.add({ name: 'shipping' });
    await tags.add({ name: 'shoes' });
    await tags.add({ name: 'soccer' });
    await tags.add({ name: 'socks' });
    await tags.add({ name: 'sports' });
    await tags.add({ name: 'teeth' });
    await tags.add({ name: 'townhall' });
    await tags.add({ name: 'toys' });
    await tags.add({ name: 'udemy' });
    await tags.add({ name: 'usedstuff' });
    await tags.add({ name: 'website' });
    await tags.add({ name: 'work' });

    const transactionTypes = db.collection('transactionTypes');

    await transactionTypes.add({ name: 'Income', operation: '+' });
    await transactionTypes.add({ name: 'Expense', operation: '-' });
    await transactionTypes.add({ name: 'Own transfer', operation: '=' });
    await transactionTypes.add({ name: 'External transfer', operation: '-' });
};
