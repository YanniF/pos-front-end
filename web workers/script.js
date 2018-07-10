"use strict";

let worker;

function init() {
  worker = new Worker('webWorkerSoma.js');

  worker.onmessage = function(e) {
    document.getElementById('resultado').innerHTML += e.data;
  }

  worker.onerror = function(e) {
    document.getElementById('resultado').innerHTML = "Erro: " + e.message;
  }

  document.getElementById('btnSomar').addEventListener('click', somar);
}

function somar(e) {
  const valor1 = parseFloat(document.getElementById('valor1').value);
  const valor2 = parseFloat(document.getElementById('valor2').value);

  document.getElementById('resultado').innerHTML = valor1 + ' + ' + valor2 + ' = ';

  worker.postMessage([valor1, valor2]);

  e.preventDefault();
}

init();