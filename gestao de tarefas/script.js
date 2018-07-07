"use strict";

let bd;

function iniciar() {

  if (!window.indexedDB) {
    alert('Seu navegador não suporta armazenamento local');
    return;
  }

  const request = indexedDB.open('tarefas', 1);
  request.onerror = (e) => {
    console.log('Não foi possível usar o armazenamento local: ' + e.error.name);
  }
  request.onsuccess = (e) => {
    bd = e.target.result;
    atualizaTabela();
  }
  request.onupgradeneeded = (e) => {
    bd = e.target.result;
    if (!bd.objectStoreNames.contains('tarefas')) {
      const tarefas = bd.createObjectStore('tarefas', {
        autoIncrement: true
      });
      tarefas.createIndex('tarefa', 'tarefa', {
        unique: false
      });
      tarefas.createIndex('data', 'data', {
        unique: false
      });
    }
  }

  document.getElementById('btnIncluir').addEventListener('click', incluirTarefa, false);
  document.getElementById('btnBuscarTarefa').addEventListener('click', buscarTarefa, false);
  document.getElementById('btnBuscarData').addEventListener('click', buscarData, false);
}

function incluirTarefa() {
  const tarefa = document.getElementById('tarefa');
  const data = document.getElementById('data');
  const prioridade = document.getElementById('prioridade');

  if (tarefa.value == '' || data.value == '') {
    mostraAlerta('Preencha os campos <strong>Tarefa</strong> e <strong>Data limite</strong> antes de fazer a inclusão', 0);
  }

  const tarefas = bd.transaction(['tarefas'], 'readwrite').objectStore('tarefas');

  const request = tarefas.add({
    tarefa: tarefa.value, 
    data: data.value,
    prioridade: prioridade.value
  });

  request.onsuccess = (e) => {
    mostraAlerta('Tarefa incluída com sucesso.', 1);

    tarefa.value = '';
    data.value = '';
    prioridade.value = 1;

    atualizaTabela();
  }

  request.onerror = (e) => {
    mostraAlerta('Não foi possível incluir a tarefa.', 0);
  }
}

function mostraAlerta(msg, status) {
  const alerta = document.getElementById('alerta');

  if (status == 0) // erro
    alerta.setAttribute('class', 'alert alert-danger');

  else if (status == 1) // sucesso
    alerta.setAttribute('class', 'alert alert-success');

  else
    alerta.setAttribute('class', 'alert alert-info');

  alerta.innerHTML = msg;
  setTimeout(limpaAlerta, 5000);
}

function limpaAlerta() {
  const alerta = document.getElementById('alerta');
  
  alerta.setAttribute('class', 'alert');
  alerta.innerHTML = '&nbsp;';
}

function atualizaTabela() {
  const corpoTabela = document.getElementById('tabela');
  const linhasTabela = '';

  bd.transaction('tarefas').objectStore('tarefas').openCursor().onsuccess = function (e) {
    const cursor = e.target.result;

    if (cursor) {
      linhasTabela += '<tr>' +
        '<td>' + cursor.key + '</td>' +
        '<td id="tarefa-' + cursor.key + '">' + cursor.value.tarefa + '</td>' +
        '<td id="data-' + cursor.key + '">' + cursor.value.data + '</td>' +
        '<td id="prioridade-' + cursor.key + '">' + cursor.value.prioridade + '</td>' +
        '<td id="botoes-' + cursor.key + '">' +
        '<button class="btn btn-info" onclick="editarTarefa(' + cursor.key + ')"><span class="glyphicon glyphicon-pencil"></span></button>' +
        '<button class="btn btn-danger" onclick="apagarTarefa(' + cursor.key + ')"><span class="glyphicon glyphicon-trash"></span></button>' +
        '</td></tr>';
      cursor.continue();
    } 
    else {
      corpoTabela.innerHTML = linhasTabela;
    }
  }
}

function editarTarefa(n) {
  const tarefa = document.getElementById('tarefa-' + n);
  const data = document.getElementById('data-' + n);
  const prioridade = document.getElementById('prioridade-' + n);
  const tarefaAnterior = tarefa.innerHTML;
  const dataAnterior = data.innerHTML;
  const prioridadeAnterior = prioridade.innerHTML;
  const botoes = document.getElementById('botoes-' + n);

  tarefa.innerHTML = '<input class="form-control" type="text" id="tarefaNova-' + n + '" value="' + tarefaAnterior + '" data-anterior="' + tarefaAnterior + '"/>';
  data.innerHTML = '<input class="form-control" type="date" id="dataNova-' + n + '" value="' + dataAnterior + '" data-anterior="' + dataAnterior + '" />';
  prioridade.innerHTML = '<select class="form-control" id="prioridadeNova-' + n + '"  data-anterior="' + prioridadeAnterior + '">' +
    '<option ' + (prioridadeAnterior == 1 ? 'selected' : '') + '>1</option>' +
    '<option ' + (prioridadeAnterior == 2 ? 'selected' : '') + '>2</option>' +
    '<option ' + (prioridadeAnterior == 3 ? 'selected' : '') + '>3</option>' +
    '</select>';
  botoes.innerHTML =
    '<button class="btn btn-success" onclick="alteracaoOK(' + n + ')"><span class="glyphicon glyphicon-ok"></span></button>' +
    '<button class="btn btn-danger" onclick="alteracaoCancelada(' + n + ')"><span class="glyphicon glyphicon-remove"></span></button>';
}

function alteracaoOK(n) {
  const tarefaNova = document.getElementById('tarefaNova-' + n).value;
  const dataNova = document.getElementById('dataNova-' + n).value;
  const prioridadeNova = document.getElementById('prioridadeNova-' + n).value;

  bd.transaction(['tarefas'], 'readwrite').objectStore('tarefas').get(n).onsuccess = function(e) {
    const tarefa = e.target.result;

    if(tarefa) {
      tarefa.tarefa = tarefaNova;
      tarefa.data = dataNova;
      tarefa.prioridade = prioridadeNova;
      e.target.source.put(tarefa,n).onsuccess = (e) => {
        mostraAlerta('Alteração concluída.', 1);
      }
    } else {
      mostraAlerta('Não foi possível realizar a alteração.', 0);
    }
    atualizaTabela();
  }
}

function alteracaoCancelada(n) {
  document.getElementById('tarefa-' + n).innerHTML = document.getElementById('tarefaNova-' + n).getAttribute('data-anterior');
  document.getElementById('data-' + n).innerHTML = document.getElementById('dataNova-' + n).getAttribute('data-anterior');
  document.getElementById('prioridade-' + n).innerHTML = document.getElementById('prioridadeNova-' + n).getAttribute('data-anterior');
  document.getElementById('botoes-' + n).innerHTML =
    '<button class="btn btn-info" onclick="editarTarefa(' + n + ')"><span class="glyphicon glyphicon-pencil"></span></button>' +
    '<button class="btn btn-danger" onclick="apagarTarefa(' + n + ')"><span class="glyphicon glyphicon-trash"></span></button>';

}

function apagarTarefa(n) {
  bd.transaction(['tarefas'], 'readwrite').objectStore('tarefas').delete(n).onsuccess = (e) => {
    mostraAlerta('Tarefa excluída', 1);
  }
  atualizaTabela();
}

function buscarTarefa() {
  document.getElementById('resultados').innerHTML = '';
  const tarefa = document.getElementById('buscaTarefa').value;
  const faixaBusca = IDBKeyRange.bound(tarefa, tarefa.substr(0,tarefa.length-1) + String.fromCharCode(tarefa.charCodeAt(tarefa.length - 1) + 1), false, true);
  
  bd.transaction('tarefas').objectStore('tarefas').index('tarefa').openCursor(faixaBusca).onsuccess = listaResultado;
  
  document.getElementById('cabecalho').innerHTML = 'Resultados para <strong>Tarefa = "'+tarefa+'"</strong>';
  document.getElementById('buscaTarefa').value = '';
  document.getElementById('buscaData').value = '';
  
}

function buscarData() {
  document.getElementById('resultados').innerHTML = '';
  const data = document.getElementById('buscaData').value;
  const faixaBusca = IDBKeyRange.upperBound(data, false);

  bd.transaction('tarefas').objectStore('tarefas').index('data').openCursor(faixaBusca).onsuccess = listaResultado;
  
  document.getElementById('cabecalho').innerHTML = 'Resultados para <strong>Data <= "' + data + '"</strong>';
  document.getElementById('buscaTarefa').value = '';
  document.getElementById('buscaData').value = '';  
}

function listaResultado(e) {
  const cursor = e.target.result;

  if(cursor) {
    document.getElementById('resultados').innerHTML += 
      '<p>Código: ' + cursor.primaryKey +
      '<br/>Tarefa: ' + cursor.value.tarefa +
      '<br/>Data: ' + cursor.value.data +
      '<br/>Prioridade: ' + cursor.value.prioridade+'</p>';
    cursor.continue();
  }
}

window.addEventListener('load', iniciar, false);