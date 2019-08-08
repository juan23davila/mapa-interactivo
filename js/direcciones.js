direccionesModulo = (function () {
  var servicioDirecciones // Servicio que calcula las direcciones
  var mostradorDirecciones // Servicio muestra las direcciones
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;

    // Calcula las rutas cuando se cambian los lugares de desde, hasta o algun punto intermedio
  function calcularRutasConClic () {
    document.getElementById('comoIr').addEventListener('change', function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    document.getElementById('calcularMuchos').addEventListener('click', function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    var listasLugares = document.getElementsByClassName('lugares')
    for (var j = 0; j < listasLugares.length; j++) {
      listasLugares[j].addEventListener('change', function () {
        if (document.getElementById('desde').value != '' && document.getElementById('desde').value != '') {
          direccionesModulo.calcularYMostrarRutas()
        }
      })
    }
  }

    // Agrega la dirección en las lista de Lugares Intermedios en caso de que no estén
  function agregarDireccionEnLista (direccion, coord) {
    var lugaresIntermedios = document.getElementById('puntosIntermedios')

    var haceFaltaAgregar = true
    for (i = 0; i < lugaresIntermedios.length; ++i) {
      if (lugaresIntermedios.options[i].text.replace(/\r?\n|\r/g, ' ') === direccion.replace(/\r?\n|\r/g, ' ')) {
        haceFaltaAgregar = false
      }
    }
    if (haceFaltaAgregar) {
      var opt = document.createElement('option')
      opt.value = coord
      opt.innerHTML = direccion
      lugaresIntermedios.appendChild(opt)
    }
  }

    // Agrega la dirección en las listas de puntos intermedios y lo muestra con el street view
  function agregarDireccionYMostrarEnMapa (direccion, ubicacion) {
    that = this
    var ubicacionTexto = ubicacion.lat() + ',' + ubicacion.lng()
    agregarDireccionEnLista(direccion, ubicacionTexto)
    mapa.setCenter(ubicacion)
    streetViewModulo.fijarStreetView(ubicacion)
    marcadorModulo.mostrarMiMarcador(ubicacion)
    lugaresModulo.inicializar();
  }

  function agregarDireccion (direccion, ubicacion) {
    that = this
    var ubicacionTexto = ubicacion.lat() + ',' + ubicacion.lng()
    agregarDireccionEnLista(direccion, ubicacionTexto)
    mapa.setCenter(ubicacion)
  }

    // Inicializo las variables que muestra el panel y el que calcula las rutas//
  function inicializar () {
    calcularRutasConClic()
        // Agrega la direccion cuando se presioná enter en el campo agregar
    $('#agregar').keypress(function (e) {
      if (e.keyCode == 13) {
        var direccion = document.getElementById('agregar').value
        geocodificadorModulo.usaDireccion(direccion, direccionesModulo.agregarDireccion)
      }
    })
        // Calcula las rutas cuando se presioná enter en el campo desde y hay un valor disitnto a vacío en 'hasta'
    $('#desde').keypress(function (e) {
      if (e.keyCode == 13 && document.getElementById('hasta').value != '') {
        direccionesModulo.calcularYMostrarRutas()
      }
    })

        // Calcula las rutas cuando se presioná enter en el campo hasta y hay un valor disitnto a vacío en 'desde'
    $('#hasta').keypress(function (e) {
      if (e.keyCode == 13 && document.getElementById('desde').value != '') {
        direccionesModulo.calcularYMostrarRutas()
      }
    })
    servicioDirecciones = new google.maps.DirectionsService()
    mostradorDirecciones = new google.maps.DirectionsRenderer({
      draggable: true,
      map: mapa,
      panel: document.getElementById('directions-panel-summary'),
      suppressMarkers: true
    })
  }

  function procesarCalculoDeRutas(result, status){
    if(status === google.maps.places.PlacesServiceStatus.OK){
      labelIndex = 0;
      //Se renderiza la ruta
      mostradorDirecciones.setDirections(result);

      //Se ubican nuevamente los marcadores
      marcadorModulo.borrarMarcadoresRuta();
      for (let index = 0; index < result.routes[0].legs.length; index++) {
        var leg = result.routes[0].legs[index];
        if(index === 0){
          marcadorModulo.agregarMarcadorRuta (leg.start_location, labels[labelIndex++ % labels.length], true);
        }
        marcadorModulo.agregarMarcadorRuta (leg.end_location, labels[labelIndex++ % labels.length], false);
      }
    }else{
      alert('No se pudo encontrar una ruta para el medio "'+document.getElementById("comoIr").value+'"');
    }
  }

    // Calcula la ruta entre los puntos Desde y Hasta con los puntosIntermedios
    // dependiendo de la formaDeIr que puede ser Caminando, Auto o Bus/Subterraneo/Tren
  function calcularYMostrarRutas () {

    //Se genera solicitud de ruta
    if(document.getElementById("desde").value != "" && 
       document.getElementById("hasta").value != ""
    ){
      var medioTrasporte;

      switch (document.getElementById("comoIr").value) {
        case "Bus/Subterraneo/Tren":
          medioTrasporte = "TRANSIT";
          break;
        case "Caminando":
          medioTrasporte = "WALKING";
          break;
        default:
          medioTrasporte = "DRIVING";
          break;
      }

      var puntosItermedios = document.getElementById("puntosIntermedios").options;

      var waypts = [];

      if(medioTrasporte != "TRANSIT"){
        for (var i = 0; i < puntosItermedios.length; i++) {
          if (puntosItermedios[i].selected) {
            waypts.push({
              location: puntosItermedios[i].text,
              stopover: true
            });
          }
        }
      }

      //Se elimina ruta pintada anteriormente
      mostradorDirecciones.setMap(null);
      mostradorDirecciones.setMap(mapa);
      
      // Se muestra el camino en el mapa
      servicioDirecciones.route({
        origin: document.getElementById("desde").value,   
        destination: document.getElementById("hasta").value,   
        travelMode: medioTrasporte,
        waypoints:waypts,
        unitSystem: google.maps.UnitSystem.METRIC
      }, procesarCalculoDeRutas);
    }else{
      alert('los campos de "Desde" y "Hasta" no pueden estar vacios');
    }
  }  

  return {
    inicializar,
    agregarDireccion,
    agregarDireccionEnLista,
    agregarDireccionYMostrarEnMapa,
    calcularYMostrarRutas
  }
}())
