"use strict"
let bd;

function iniciar() {

  if(!window.indexedDB || !window.IDBTransaction || !window.IDBKeyRange) {
    alert('Seu navegador não suporta IndexedDB');
    return;
  }

  const request = indexedDB.open('meubd', 3);
  request.onsuccess = function(e) {
    bd = e.target.result;
  }

  request.onerror = function(e) {
    console.log('Não foi possível abrir o banco de dados.');
  }

  request.onupgradeneeded = function(e) {
    console.log('Criando banco de dados');
    bd = e.target.result;

    if(!bd.objectStoreNames.contains('livros')) {
      const livros = bd.createObjectStore('livros', {keyPath: 'codigo'});
      livros.createIndex('autor', 'autor', {unique: false});
    }
    else {
      const livros = e.currentTarget.transaction.objectStore('livros');

      if(!livros.indexNames.contains('autor')) {
        livros.createIndex('autor', 'autor', {unique: false});
      }      
    }    
  }

  document.getElementById('btnForm').addEventListener('click', incluirLivro, false);
  document.getElementById('btnConsultar').addEventListener('click', consultarLivro, false);
  document.getElementById('btnConsultarAutor').addEventListener('click', consultarLivroAutor, false);
  document.getElementById('btnListar').addEventListener('click', listarLivros, false);
  document.getElementById('btnListarAutor').addEventListener('click', listarLivrosAutor, false);
  document.getElementById('btnExcluir').addEventListener('click', excluirLivro, false);
  document.getElementById('btnAlterar').addEventListener('click', alterarLivro, false);
}

function incluirLivro(e) {
  const codigo = document.getElementById('codigo');
  const titulo = document.getElementById('titulo');
  const autor = document.getElementById('autor');

  const transacao = bd.transaction(['livros'], 'readwrite');
  const livros = transacao.objectStore('livros');
  const request = livros.add({
    codigo: codigo.value,
    titulo: titulo.value,
    autor: autor.value
  });

  request.onsuccess = function(e) {
    alert('Livro cadastrado com sucesso');
    codigo.value = '';
    titulo.value = '';
    autor.value = '';
  }

  request.onerror = function(e) {
    alert('Não foi possível incluir o livro.');
  }
}

function consultarLivro(e) {
  const codigo1 = document.getElementById('codigo1').value;
  const codigo = document.getElementById('codigodd');
  const titulo = document.getElementById('titulodd');
  const autor = document.getElementById('autordd');

  const transacao = bd.transaction(['livros'], 'readonly');
  const livros = transacao.objectStore('livros');
  const request = livros.get(codigo1);
  
  request.onsuccess = function(e) {
    if(e.target.result) { // diferente de undefined
      const livro = e.target.result;

      codigo.innerHTML = livro.codigo;
      titulo.innerHTML = livro.titulo;
      autor.innerHTML = livro.autor;
    }
    else {
      codigo.innerHTML = "Livro não encontrado.";
      titulo.innerHTML = '';
      autor.innerHTML = '';
    }

    request.onerror = function(e) {
      alert('Não foi possível consultar o banco de dados.');
    }
  }
}

function consultarLivroAutor(e) {
  const autor1 = document.getElementById('autor1').value;
  const codigo = document.getElementById('codigodda');
  const titulo = document.getElementById('titulodda');
  const autor = document.getElementById('autordda');

  const livros = bd.transaction('livros').objectStore('livros');
  const indiceAutor = livros.index('autor')
  indiceAutor.get(autor1).onsuccess = function(e) {
    if(e.target.result) { 
      const livro = e.target.result;

      codigo.innerHTML = livro.codigo;
      titulo.innerHTML = livro.titulo;
      autor.innerHTML = livro.autor;
    }
    else {
      codigo.innerHTML = "Autor não encontrado.";
      titulo.innerHTML = '';
      autor.innerHTML = '';
    }

    request.onerror = function(e) {
      alert('Não foi possível consultar o banco de dados.');
    }
  }
}


function listarLivros(e) {
  const lista = document.getElementById('lista');
  lista.innerHTML = '<ul>';

  bd.transaction('livros').objectStore('livros').openCursor().onsuccess = function(e) {
    const cursor = e.target.result;

    if(cursor) {
      const livro = cursor.value;
      lista.innerHTML += `<li>Livro ${livro.codigo}: "${livro.titulo}" - ${livro.autor}</li>`;
      cursor.continue();
    }
    else {
      lista.innerHTML += '</ul>';
    }
  }
}

function listarLivrosAutor(e) {
  const lista = document.getElementById('listaAutor');
  const autor = document.getElementById('autor2').value;
  const autor1 = autor.substr(0, autor.length-1) + String.fromCharCode(autor.charCodeAt(autor.length - 1) + 1); // nossa
  const faixa = IDBKeyRange.bound(autor, autor1, false, true);

  lista.innerHTML = '<ul>';

  bd.transaction('livros').objectStore('livros').index('autor').openCursor(faixa).onsuccess = function(e) {
    const cursor = e.target.result;

    if(cursor) {
      const livro = cursor.value;
      lista.innerHTML += `<li>Livro ${livro.codigo}: "${livro.titulo}" - ${livro.autor}</li>`;
      cursor.continue();
    }
    else {
      lista.innerHTML += '</ul>';
    }
  }
}

function excluirLivro(e) {
  const codigo2 = document.getElementById('codigo2').value;

  bd.transaction(['livros'], 'readwrite').objectStore('livros').delete(codigo2).onsuccess = function(e) {
    alert('Livro excluído com sucesso.');
  }
}

function alterarLivro(e) {
  const codigo3 = document.getElementById('codigo3');
  const titulo3 = document.getElementById('titulo3');
  const autor3 = document.getElementById('autor3');

  bd.transaction(['livros'], 'readwrite').objectStore('livros').get(codigo3.value).onsuccess = function(e) {
    if(e.target.result) {
      const livro = e.target.result;
      livro.titulo = titulo3.value;
      livro.autor = autor3.value;

      e.target.source.put(livro).onsuccess = function(e) {
        codigo3.value = '';
        titulo3.value = '';
        autor3.value = '';
  
        alert('Livro alterado com sucesso');
      }
    }
    else {
      alert('Livro não encontrado');
    }
  }
}

window.addEventListener('load', iniciar, false);