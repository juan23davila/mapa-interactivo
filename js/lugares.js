lugaresModulo = (function () {
  var servicioLugares // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

    // Completa las direcciones ingresadas por el usuario a y establece los límites
    // con un círculo cuyo radio es de 20000 metros.
  function autocompletar () {
    var miPosicion;

    if (marcadorModulo.existeMiMarcador()) {
      var miPosicion = marcadorModulo.damePosicion();
    } else {
      miPosicion = posicionCentral;
    }
    
    var circle = new google.maps.Circle( { center: miPosicion,   radius: 20000 }) 
      
    var input = document.getElementById('direccion');

    var options = {
      bounds: circle.getBounds(),
      types: ['establishment']
    };
    
    autocompleteBuscar = new google.maps.places.Autocomplete(
                          document.getElementById('direccion'), options
                         );
    autocompleteDesde = new google.maps.places.Autocomplete(
                          document.getElementById('desde'), options
                        );
    autocompleteHasta = new google.maps.places.Autocomplete(
                          document.getElementById('hasta'), options
                        );
    autocompleteAgregar = new google.maps.places.Autocomplete(
                          document.getElementById('agregar'), options
                        );
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
