lugaresModulo = (function () {
  var servicioLugares // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

    // Completa las direcciones ingresadas por el usuario a y establece los límites
    // con un círculo cuyo radio es de 20000 metros.
  function autocompletar () {
        /* Completar la función autocompletar(): autocompleta los 4 campos de texto de la
        página (las direcciones ingresables por el usuario).
        Para esto creá un círculo con radio de 20000 metros y usalo para fijar
        los límites de la búsqueda de dirección. El círculo no se debe ver en el mapa. */
  }

    // Inicializo la variable servicioLugares y llamo a la función autocompletar
  function inicializar () {
    servicioLugares = new google.maps.places.PlacesService(mapa)
    autocompletar()
  }

  function obtenerSolicitud(posicion){
    return {
      location: posicion,
      radius: document.getElementById('radio').value,
      type: document.getElementById('tipoDeLugar').value
    }
  }

  // Busca lugares con el tipo especificado en el campo de TipoDeLugar
  function buscarCerca (posicion) {
     service = new google.maps.places.PlacesService(mapa);
     let request = obtenerSolicitud(posicion);
     service.nearbySearch(request, marcadorModulo.marcarLugares);
  }

  return {
    inicializar,
    buscarCerca
  }
})()
