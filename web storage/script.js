function armazenar() {
  const nome = document.getElementById('nome').value;
  const idade = document.getElementById('idade').value;

  if(nome == '' || idade == '') 
    return false;

  const cliente = {
    nome: nome,
    idade: idade
  };

  // sessionStorage.setItem('nome', nome);

  localStorage.setItem('cliente', JSON.stringify(cliente));
}

function recuperar() {
  // const nome.innerHTML = sessionStorage.getItem('nome');
  const nome = document.getElementById('nome');
  const idade = document.getElementById('idade');

  nome.innerHTML = JSON.parse(localStorage.getItem('cliente')).nome;
  idade.innerHTML = JSON.parse(localStorage.getItem('cliente')).idade;
}