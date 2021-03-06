(function() {
    var options = {};
    var currencies = new Array();

    function getExchangeRate() {
        if (!(options.base && options.target)) {
            log('err');
        }

        var exchangeUrl =
            'http://free.currencyconverterapi.com/api/v5/convert?compact=y&q=' + options.base +
            '_' + options.target;

        log(exchangeUrl);
        getData(exchangeUrl);
    }

    function handleData(data) {
        var key = options.base + '_' + options.target;

        if (data[key]) {
            console.log('inside callback', data[key].val);
            var rate = data[key].val;
            $('body').trigger('rateConfirmed', rate);
            return;
        }
        console.error('Call to remote currency exchange API succeed, but no rates data found.');
    }

    function getData(url) {
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
        // remove return characters
        https://stackoverflow.com/questions/21572938/what-is-the-character-in-chrome-console
        var words = $(textareaId).val().replace(/(\r\n|\n|\r)/gm, ",");

        // Split text by whitespace or comma
        words = words.split(/[ ,]+/);

        words.forEach(function(word) {
            if (isNumeric(word)) {
                currencies.push(+word); // convert to number
            }
        });
        log(currencies);
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

    function resetState() {
        if (currencies.length > 0) {
            currencies = new Array();
        }
        options = {};
    }

    function getOptions() {
        resetState();
        options.decimals = parseInt($('#options_decimals').val());
        options.base = $('#options_base').val();
        options.target = $('#options_target').val();
        log(options);
    }

    $('#action').click(function() {
        getOptions();
        getCurrenciesFromText('textarea#input');
        getExchangeRate();
    });

    $('body').on('rateConfirmed', function(event, rate) {
        setOutput(currencies, rate, 'textarea#output');
    });
}());
