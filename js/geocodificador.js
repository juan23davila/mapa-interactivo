geocodificadorModulo = (function () {
  var geocodificador; // Geocodificador que dada una dirección devuelve una coordenada
  
  /**
   * Se quitan los espacios al inicio y final y se reemplazan los espacios intermedios 
   * por el caracter '+'
   */
  function addressToURL(direccion){
    let addressOk = direccion.trim();
    addressOk = addressOk.replace(', ',',')
    addressOk = addressOk.replace(/\s{2,}/g, '+');
    addressOk = addressOk.replace(' ','+')
    return addressOk;
  }

  /**
   * Obtiene una dirección y con la ayuda de Geocoder API obtiene las cordenadas de esta
   * @param {dirección a buscar cordenadas} direccion 
   */
  function generarUrl(direccion){
    let url = "https://maps.googleapis.com/maps/api/geocode/"
    let outputFormat = "json"
    let addressToDecode = "?address="+addressToURL(direccion);
    let key = "&key=AIzaSyDJt3ENG3mwB_TP6M4novLWLsXu59cxeRs";

    return url+outputFormat+addressToDecode+key;
  }

  /**
   * Se procesa la información entregada por la API Geocoding
   */
  function procesarRespuesta(textoApi, direccion, funcionALlamar){
    let objCordenada = JSON.parse(textoApi);

    //Se valida si la respuesta del API fue buena
    if(objCordenada.status === "OK"){
      //Se busca cordenadas en objeto
      objCordenada.results.forEach(infoAddress => {
        let miLatLng = new google.maps.LatLng(infoAddress.geometry["location"]);
        funcionALlamar(direccion, miLatLng)
      });
      //llamar la funcion obtenida como parametro sus respectivos parametros
      variable = objCordenada;
    }else{
      alert("No se pudo encontrar dirección");
    }
  }

    // Permite obtener las coordenadas y las usa con la función llamada por parámtero
  function usaDireccion (direccion, funcionALlamar) {
     // Se llama API geocodificador con la direccion obtenida por parametro 
     // y se obtiene informacion geocodificada
     var xhttp = new XMLHttpRequest();
     let url = generarUrl(direccion);

     xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
          procesarRespuesta(xhttp.responseText, direccion, funcionALlamar);
       }
     };

     // se ejecuta la solicitud bajo las condiciones dadas anteriormente
     xhttp.open("GET", url , true); 
     xhttp.send();
  }

    // Inicializo el geocoder que obtiene las corrdenadas a partir de una dirección
    // La variable dirección es igual al texto ingresado por el usuario
    // Llama a la función usaDirecciin para agregarla a los listados y mostrarlo en el mapa
  function inicializar () {
    var that = this
    geocodificador = new google.maps.Geocoder()

        // cuando se presiona la tecla enter en el campo direccion, se agrega la dirección y se muestra en el mapa
    document.querySelector('#direccion').addEventListener('keypress', function (e) {
      var key = e.which || e.keyCode
      if (key === 13) { // 13 is enter
                // code for enter
        var direccion = document.getElementById('direccion').value
        that.usaDireccion(direccion, direccionesModulo.agregarDireccionYMostrarEnMapa)
      }
    })
  }

  return {
    usaDireccion,
    inicializar
  }
})()
