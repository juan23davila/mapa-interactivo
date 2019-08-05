streetViewModulo = (function () {
  var panorama // 'Visor' de StreetView

  function inicializar () {
    if (marcadorModulo.existeMiMarcador()) {
      var miPosicion = marcadorModulo.damePosicion()
    } else {
      miPosicion = posicionCentral
    }

    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
          position: miPosicion,
          pov: {
            heading: 34,
            pitch: 10
          }
        });

    mapa.setStreetView(panorama);
  }

    // Actualiza la ubicación del Panorama
  function fijarStreetView (ubicacion) {
    panorama.setPosition(ubicacion);
  }

  return {
    inicializar,
    fijarStreetView
  }
})()
