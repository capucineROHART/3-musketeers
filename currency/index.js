const axios = require('axios'); //calls for existing libraries
const money = require('money');

const RATES_URL = 'https://api.exchangeratesapi.io/latest'; //stores urls where the conversion rates are saved
const BLOCKCHAIN_URL = 'https://blockchain.info/ticker';
const CURRENCY_BITCOIN = 'BTC';

const isAnyBTC = (from, to) => [from, to].includes(CURRENCY_BITCOIN);

module.exports = async opts => { //function called in cli.js
  const {amount = 1, from = 'USD', to = CURRENCY_BITCOIN} = opts;
  const promises = [];
  let base = from;

  const anyBTC = isAnyBTC(from, to);

  if (anyBTC) { //if we need to convert bitcoins in one way or another
    base = from === CURRENCY_BITCOIN ? to : from; //if from is bitcoin, then to is USD ; else from is bitcoin
    //bitcoin is mandatory one way or another
    promises.push(axios(BLOCKCHAIN_URL)); //stores the conversion rates found into an array
  }

  promises.unshift(axios(`${RATES_URL}?base=${base}`)); //checks the rate on the website for the currency chosen 

  try {
    const responses = await Promise.all(promises); //waits for responses from the website
    const [rates] = responses;

    money.base = rates.data.base;
    money.rates = rates.data.rates;

    const conversionOpts = {
      from,
      to
    };

    if (anyBTC) {
      const blockchain = responses.find(response =>
        response.data.hasOwnProperty(base)
      );

      Object.assign(money.rates, {
        'BTC': blockchain.data[base].last
      });
    }

    if (anyBTC) { //if both currency are defined, assign values to variables
      Object.assign(conversionOpts, {
        'from': to,
        'to': from
      });
    }

    return money.convert(amount, conversionOpts);
  } catch (error) { //if error occured
    throw new Error (
      '💵 Please specify a valid `from` and/or `to` currency value!'
    );
  }
};
