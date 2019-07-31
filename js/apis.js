var mapa;

/* Crear la variable posicionCentral con las coordenadas donde se va a centrar el mapa */
var posicionCentral = {lat: 6.154131, lng: -75.58650999999999};

// Inicializa el mapa con un valor de zoom y una locación en el medio
function inicializarMapa () {
  mapa = new google.maps.Map(
    document.getElementById('map'),
    {zoom: 10, center: posicionCentral}
  );

  geocodificadorModulo.inicializar()
  marcadorModulo.inicializar()
  direccionesModulo.inicializar()
  lugaresModulo.inicializar()
  streetViewModulo.inicializar()
}
