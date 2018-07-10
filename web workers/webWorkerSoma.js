"use strict";

console.log('Worker inciado');

onmessage = function(e) {
  const soma = e.data[0] + e.data[1];

  postMessage(soma);
}