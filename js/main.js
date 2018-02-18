(function() {
    var options = {};
    var currencies = new Array();
    var baseCurrency = 'GBP';
    var targetCurrency = 'USD';

    function getExchangeRate(baseCurrency, targetCurrency) {
        if (!(baseCurrency && targetCurrency)) {
            log('err');
        }

        var exchangeUrl =
            'https://api.fixer.io/latest?base=' + baseCurrency +
            '&symbols=' + targetCurrency;

        log(exchangeUrl);
        getData(exchangeUrl, targetCurrency);
    }

    function handleData(data) {
        if (data.rates) {
            console.log('inside callback', data.rates[targetCurrency]);
            var rate = data.rates[targetCurrency];
            $('body').trigger('rateConfirmed', rate);
        }
        console.error('Call to remote currency exchange API succeed, but no rates data found.');
    }

    function getData(url, targetCurrency) {
        $.ajax({
            url: url,
            type: 'GET',
            success: handleData
        }).fail(function(err) {
            console.error('Call to remote currency exchange API failed:', err);
        });
    }

    function log(data) {
        console.log('###### Logging:', data);
    }

    function isNumeric(num){
        // https://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
        return !isNaN(num);
    }

    function getCurrenciesFromText(textareaId) {
        // Split text by whitespace or comma
        var words = $(textareaId).val().split(/[ ,]+/);
        words.forEach(function(word) {
            if (isNumeric(word)) {
                currencies.push(+word); // convert to number
            }
        });
        console.log('### getCurrenciesFromText =', currencies);
    }

    function setOutput(currencies, rate, textareaId) {
        var output = '';
        currencies.forEach(function(currency) {
            var line;
            if (options.decimals > -1) {
                line = (currency * rate).toFixed(options.decimals);
            } else {
                line = (currency * rate);
            }
            output += line + '\n';
        });
        $(textareaId).val(output);
    }

    function resetCurrencies() {
        if (currencies.length > 0) {
            currencies = new Array();
        }
    }

    function getOptions() {
        resetCurrencies();
        options.decimals = parseInt($('#select_decimals').val());
        console.log('### options =', options);
    }

    $('#action').click(function() {
        getOptions();
        getCurrenciesFromText('textarea#input');
        getExchangeRate(baseCurrency, targetCurrency);
    });

    $('body').on('rateConfirmed', function(event, rate) {
        setOutput(currencies, rate, 'textarea#output');
    });
}());

// Place any jQuery/helper plugins in here.
