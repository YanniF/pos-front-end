function iniciar() {
  const arquivos = document.getElementById('arquivos');
  const botao = document.getElementById('botaoArquivos');
  
  arquivos.addEventListener('change', trataArquivos);
  botao.addEventListener('click', function() {
    arquivos.click();
  });
}

function trataArquivos(e) {
  const lista = document.getElementById('listaArquivos');
  const total = document.getElementById('total');
  const imagens = document.getElementById('imagens');
  const textos = document.getElementById('textos');
  const audios = document.getElementById('audios');
  const videos = document.getElementById('videos');
  const listaArq = e.target.files;
  let soma = 0;
  let filtro = '';

  lista.innerHTML = "";
  imagens.innerHTML = "";
  textos.innerHTML = "";
  audios.innerHTML = "";
  videos.innerHTML = "";

  for (let i = 0; i < listaArq.length; i++) {

    // atualiza tabela
    lista.innerHTML += `
      <tr>
        <td> ${listaArq[i].name}</td>
        <td> ${listaArq[i].type}</td>
        <td> ${(listaArq[i].size / 1000000).toFixed(2)} MB</td>
      </tr>
    `;
    soma += listaArq[i].size;

    // imagens
    filtro = RegExp('image/*');

    if(filtro.test(listaArq[i].type)) {
      
      const img = document.createElement('img');
      img.src = window.URL.createObjectURL(listaArq[i]);
      img.classList = 'img-responsive';
      img.onload = function () {
        window.URL.revokeObjectURL(this.src);
      }

      imagens.appendChild(img);
    }

    // texto
    filtro = RegExp('text/*');

    if(filtro.test(listaArq[i].type)) {
      const texto = new FileReader();
      texto.readAsText(listaArq[i]);
      texto.onload = (e) => {
        textos.innerHTML += `<pre class="texto"> ${e.target.result} </pre>`;
      }
    }

    // audio
    filtro = RegExp('audio/*');

    if(filtro.test(listaArq[i].type)) {
      const audio = new FileReader();
      const nome = listaArq[i].name;
      audio.readAsDataURL(listaArq[i]);

      audio.onload = (e) => {
        audios.innerHTML += `<p><h3>${nome}</h3><audio src="${e.target.result}" controls></audio></p>`;
      }
    }

    // videos
    filtro = RegExp('video/*');

    if(filtro.test(listaArq[i].type)) {
      const video = new FileReader();
      const nome = listaArq[i].name;
      video.readAsDataURL(listaArq[i]);

      video.onload = (e) => {
        videos.innerHTML += `<p><h3>${nome}</h3><video src="${e.target.result}" controls></video></p>`;
      }

      video.onerror = (e) => {
        switch(e.target.error.name) {
          case 'NotFoundError':
            videos.innerHTML += "Arquivo não encontrado.";
            break;
          case 'SecurityError':
            videos.innerHTML += "Erro de segurança.";
            break;
          case 'NotReadableError':
            videos.innerHTML += "Arquivo não pode ser lido.";
            break;
          case 'AbortError':
            videos.innerHTML += "Cancelado pelo usuário.";
            break;
          default: 
            videos.innerHTML += "Erro: " + e.target.error.name;
        }
      }

      video.onprogress = (e) => {
        if(e.lengthComputable)
          console.log(Math.round(e.loaded / e.total * 100) + "%");
      }
    }
  }
  total.innerHTML = 'Total: ' + (soma / 1000000).toFixed(2) + ' MB'
}

iniciar();