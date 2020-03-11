let markovGenerator = null,
    decision = document.getElementById('decision'),
    status = document.getElementById('status'),
    genButton = document.getElementById('generate');

function load(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {          
          callback(xhr.responseText);          
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
     console.error(xhr.statusText);
    };
    xhr.send(null);    
}

function setStatus(text) {
    status.style.display = (text === '') ? 'none' : 'block';
}

function loadSource(callback) {
        setStatus('loading');

        load('src/decisions.txt', function(data) {
            let plainText = data;
    
            setStatus('processing');
            markovGenerator = new Text(plainText);
    
            callback();
        });
}

function startup() {

    // setup
    genButton.addEventListener('click', generateDecision);

    loadSource(function() {
        generateDecision();
    });
}

function generateDecision() {
    setStatus('generating decisions');
    genButton.disabled = 'disabled';
    decision.innerHTML = '';

    setTimeout(function() {

        let decisionMin = getRandomRange(50,60), 
            decisionMax = getRandomRange(70,150),
            output = '';

        output = getMarkovSentence(decisionMin, decisionMax);  
        decision.innerHTML = output;
        
        setStatus('');
        genButton.disabled = '';

    }, 50);
}

function getMarkovSentence(min, max) {
    let line = '',
        tries = 1;
    do {
        line = markovGenerator.makeSmallSentence(min, max);
        tries++;
    } while (line == null || line == 'null' || line == '' || tries > 50)

    return line;
}

function getRandomRange(start, end) {
    return Math.floor(Math.random() * (end-start+1)) + start; 
}

startup();