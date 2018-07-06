let watchID;

function iniciar() {
  if(!!navigator.geolocation) {
    // navigator.geolocation.getCurrentPosition(mostraCoords, trataGeoErros);
    watchID = navigator.geolocation.watchPosition(mostraCoords, trataGeoErros, { enableHighAccuracy: true, maximumAge: 15000, timeout: 5000 });
  }
  else {
    const campo = document.getElementById('coordenadas');
    campo.innerHTML = 'Seu navegador não suporta a geolocalização.';
    campo.style.fontStyle = 'italic';
    campo.style.color = 'crimson';
  }
}

function mostraCoords(posicao) {
  console.dir(posicao);
  
  const campo = document.getElementById('coordenadas');
  campo.innerHTML = 'Latitude: ' + posicao.coords.latitude + ". Longitude: " + posicao.coords.longitude;
  
  const mapa = `http://maps.googleapis.com/maps/api/staticmap?center=${posicao.coords.latitude},${posicao.coords.longitude}
                &zoom=17&size=600x350&maptype=roadmap&markers=color:red|label:Y|${posicao.coords.latitude},${posicao.coords.longitude}`;
  document.getElementById('mapa').innerHTML = '<img src="' + mapa + '"/>';
}

function trataGeoErros(erro) {
  const campo = document.getElementById('coordenadas');
  campo.style.color = 'crimson';
  campo.style.fontWeight = 'bold';

  switch (erro.code) {
    case erro.PERMISSION_DENIED:
      campo.innerHTML = 'Permissão negada.';
      break;
    case erro.POSITION_UNAVAILABLE:
      campo.innerHTML = 'A localização não está disponível.';
      break;
    case erro.TIMEOUT:
      campo.innerHTML = 'Tempo de obtenção de localização esgotado.';
      break;
    default:
      campo.innerHTML = 'Erro: ' + erro.code;
  }
}

window.addEventListener('load', iniciar, false);