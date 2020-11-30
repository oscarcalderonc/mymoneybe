// module.exports = async (db) => {
//     const accounts = db.collection('accounts');

//     // obj.id to get the id
//     const savings = await accounts.add({
//         cash: false,
//         creditCard: false,
//         loan: false,
//         name: 'Savings Account',
//         readOnly: true,
//     });

//     {
//         bankId: , 
//         acctyp_id: , 
//         initial_balance: , 
//         initial_balance_date: , 
//         current_balance: , 
//         show_in_reports: , 
//         list_order: , 
//         credit_limit: , 
//         loan_amount: , 
//         block_on_overdraft: , 
//         name: , 
//         overdraft_limit: 
//      } 
     
//      VALUES (8, 2, 1, '$0.00', '2016-12-12 02:00:00-06', '$0.00', 1, 4, NULL, NULL, 0, 'Ahorro CITI', '$0.00');
// VALUES (9, 5, 1, '$0.00', '2016-12-12 02:00:00-06', '$0.00', 1, 5, NULL, NULL, 0, 'Payoneer Debit', '$0.00');
//  VALUES (2, 1, 1, '$0.00', '2016-12-12 02:00:00-06', '($606.00)', 1, 1, NULL, NULL, 0, 'Ahorro BA', '$0.00');
//  VALUES (5, 1, 2, '$0.00', '2016-12-12 02:00:00-06', '$296.00', 1, 2, 2000.00, NULL, 1, 'Platinum LM BA', '$0.00');
//  VALUES (7, 2, 2, '$0.00', '2016-12-12 02:00:00-06', '($371.03)', 1, 3, 3000.00, NULL, 1, 'Platinum LM CITI', '$0.00');
//  VALUES (11, 2, 2, '$3,450.00', '2018-11-08 06:41:25.510583-06', '$0.00', 0, 99, NULL, NULL, 0, 'Ahorro DUMMY 2', NULL);

//     const cash = await accounts.add({
//         cash: true,
//         creditCard: false,
//         loan: false,
//         name: 'Cash',
//         readOnly: true,
//     });

//     const creditCard = await accounts.add({
//         cash: false,
//         creditCard: false,
//         loan: false,
//         name: 'Credit Card',
//         readOnly: true,
//     });

//     const banks = db.collection('banks');

//     const bancoAgricola = await banks.add({
//         name: 'Banco Agricola',
//         acronym: 'BA',
//     });

//     const bancoCuscatlan = await banks.add({
//         name: 'Banco Cuscatlan',
//         acronym: 'CITI',
//     });

//     const payoneer = await banks.add({
//         name: 'Payoneer',
//         acronym: 'PYN',
//     });

// };
