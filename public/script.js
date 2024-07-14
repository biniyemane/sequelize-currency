const apiKey = 'fca_live_5Pgp7ENTePZLgCJX4IRyYLSmzK2W7PebX7ggeGbn';

// Elements
const baseCurrencySelect = document.getElementById('base-currency');
const targetCurrencySelect = document.getElementById('target-currency');
const amountInput = document.getElementById('amount');
const convertedAmountDisplay = document.getElementById('converted-amount');
const historicalRatesButton = document.getElementById('historical-rates');
const historicalRatesContainer = document.getElementById('historical-rates-container');
const saveFavoriteButton = document.getElementById('save-favorite');
const favoriteCurrencyPairsContainer = document.getElementById('favorite-currency-pairs');

// Set headers for API requests
let myHeaders = new Headers();
myHeaders.append("apikey", apiKey);

let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

// Fetch currency codes and populate select elements
fetch("https://api.freecurrencyapi.com/v1/currencies", requestOptions)
  .then(response => response.json())
  .then(data => {
    const currencies = Object.keys(data.data);
    currencies.forEach(currency => {
      const option1 = document.createElement('option');
      option1.value = currency;
      option1.textContent = currency;
      baseCurrencySelect.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = currency;
      option2.textContent = currency;
      targetCurrencySelect.appendChild(option2);
    });
  })
  .catch(error => console.error('Error fetching currency codes:', error));

// Event listeners
baseCurrencySelect.addEventListener('change', convertCurrency);
targetCurrencySelect.addEventListener('change', convertCurrency);
amountInput.addEventListener('input', convertCurrency);
historicalRatesButton.addEventListener('click', viewHistoricalRates);
saveFavoriteButton.addEventListener('click', saveFavoriteCurrencyPair);

// Convert currency
function convertCurrency() {
  const baseCurrency = baseCurrencySelect.value;
  const targetCurrency = targetCurrencySelect.value;
  const amount = amountInput.value;

  if (baseCurrency && targetCurrency && amount) {
    fetch(`https://api.freecurrencyapi.com/v1/latest?base_currency=${baseCurrency}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const rate = data.data[targetCurrency];
        if (rate) {
          const convertedAmount = (amount * rate).toFixed(2);
          convertedAmountDisplay.textContent = `${convertedAmount} ${targetCurrency}`;
        } else {
          convertedAmountDisplay.textContent = 'Exchange rate not available';
        }
      })
      .catch(error => console.error('Error fetching exchange rate:', error));
  }
}

// View historical rates
function viewHistoricalRates() {
  const baseCurrency = baseCurrencySelect.value;
  const targetCurrency = targetCurrencySelect.value;
  const date = '2021-01-01'; // Example date in ISO8601 format

  if (baseCurrency && targetCurrency) {
    const datetimeStart = `${date}T00:00:00Z`;
    const datetimeEnd = `${date}T23:59:59Z`;

    fetch(`https://api.freecurrencyapi.com/v1/historical?base_currency=${baseCurrency}&datetime_start=${datetimeStart}&datetime_end=${datetimeEnd}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const dateKey = Object.keys(data.data)[0];
        if (data.data && data.data[dateKey] && data.data[dateKey][targetCurrency]) {
          const rate = data.data[dateKey][targetCurrency];
          historicalRatesContainer.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
        } else {
          historicalRatesContainer.textContent = 'Historical exchange rate not available';
        }
      })
      .catch(error => console.error('Error fetching historical rates:', error));
  }
}

// Save favorite currency pair
function saveFavoriteCurrencyPair() {
  const baseCurrency = baseCurrencySelect.value;
  const targetCurrency = targetCurrencySelect.value;

  if (baseCurrency && targetCurrency) {
    const favoritePair = `${baseCurrency}/${targetCurrency}`;
    const favoriteItem = document.createElement('div');
    favoriteItem.textContent = favoritePair;
    favoriteItem.addEventListener('click', () => {
      baseCurrencySelect.value = baseCurrency;
      targetCurrencySelect.value = targetCurrency;
      convertCurrency(apiKey);
    });
    favoriteCurrencyPairsContainer.appendChild(favoriteItem);

    // Save to database
    fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ baseCurrency, targetCurrency })
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text); });
      }
      return response.json();
    })
    .then(data => {
      console.log('Favorite saved:', data);
    })
    .catch(error => {
      console.error('Error saving favorite:', error.message);
    });
  }
}

// Load favorite currency pairs from database
function loadFavorites() {
  fetch('/api/favorites')
    .then(response => response.json())
    .then(favorites => {
      favorites.forEach(favorite => {
        const favoritePair = `${favorite.baseCurrency}/${favorite.targetCurrency}`;
        const favoriteItem = document.createElement('div');
        favoriteItem.textContent = favoritePair;
        favoriteItem.addEventListener('click', () => {
          baseCurrencySelect.value = favorite.baseCurrency;
          targetCurrencySelect.value = favorite.targetCurrency;
          convertCurrency();
        });
        favoriteCurrencyPairsContainer.appendChild(favoriteItem);
      });
    })
    .catch(error => console.error('Error loading favorites:', error));
}

// Initial load
