let sources = {},
    markovGenerator = null,
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
    status.innerHTML = text;
    status.style.display = (text === '') ? 'none' : 'block';
}

function loadSource(callback) {
        setStatus('loading decisions');

        load('src/decisions.txt', function(data) {
            let plainText = data;
    
            setStatus('processing decisions');
            markovGenerator = new Text(plainText);
    
            callback();
        });
}

function startup() {

    // setup
    genButton.addEventListener('click', generateDecision);
    options = document.getElementsByName('decision-source');  

    loadSource(function() {
        generateDecision();
    });
}

function generateDecision() {
    setStatus('generating decisions');
    genButton.disabled = 'disabled';
    decision.innerHTML = '';

    setTimeout(function() {

        let decisionMin = getRandomRange(30,40), 
            decisionMax = getRandomRange(70,150),
            output = '';

        output = getMarkovSentence(decisionMin, decisionMax);  
        decision.innerHTML = output;
        twitter.innerHTML = '<a href="https://twitter.com/intent/tweet?text=AI-generated%20explanation%20for%20my%20design%20decisions:%20&quot;'+output+'&quot;%20via%20%40tomgreever at https://designdecisions.ai">Twitter</a>'
        
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