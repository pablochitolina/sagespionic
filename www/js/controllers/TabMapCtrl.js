app.controller('TabMapCtrl', function ($scope, ionicMaterialInk, $window, $ionicLoading, $compile, $cordovaGeolocation, ionicMaterialMotion) {

  $scope.imgSize = ($window.innerWidth - 32);
  $scope.enderecoReverso = 'nok';


  ionicMaterialInk.displayEffect();


  //MAPS
  var options = { timeout: 10000, enableHighAccuracy: true };
  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


    var mapOptions = {
      center: latLng,
      zoom: 17,
      backgroundColor: '#777',
      clickableIcons: false,
      disableDoubleClickZoom: true,
      //disableDefaultUI: true,
      streetViewControl: false,
      draggable: false,
      zoomControl: false,
      zoomControlOptions: false,
      scrollwheel: false,
      rotateControl: false,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListener($scope.map, 'click', function (event) {
      // in event.latLng  you have the coordinates of click

      if ($scope.marker != null) {
        $scope.marker.setMap(null);
      }
      $scope.latLngClick = event.latLng;

      $scope.marker = new google.maps.Marker({
        map: $scope.map,
        position: event.latLng
      });

      var geocoder = new google.maps.Geocoder;
      var infowindow = new google.maps.InfoWindow();
      geocodeLatLng(event.latLng, geocoder, $scope.map, infowindow, $scope.marker);


      google.maps.event.addListener($scope.marker, 'click', function () {
        infowindow.open($scope.map, $scope.marker);

      });

    });

  }, function (error) {
    $scope.enderecoReverso = "nok";
    console.log("Could not get location");
  });

  function geocodeLatLng(latlng, geocoder, map, infowindow, marker) {
    geocoder.geocode({ 'location': latlng }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {

          var rua = false, cidade = false, estado = false, bairro = false;

          //infowindow.setContent(results[1].formatted_address);
          //infowindow.open(map, marker);

          $scope.enderecoReverso = results[1].formatted_address;
          var strBairro = results[1].formatted_address.split(",")[0];

          var arrAddress = results[0].address_components;
          for (ac = 0; ac < arrAddress.length; ac++) {
            if (arrAddress[ac].types[0] == "route") {
              $scope.enderecoReversoRua = arrAddress[ac].short_name;
              rua = true;
            } else if (!rua) {
              $scope.enderecoReversoRua = "Não encontrado.";
            }
            if (arrAddress[ac].types[0] == "neighborhood" || arrAddress[ac].types[0] == "sublocality") {
              $scope.enderecoReversoBairro = arrAddress[ac].long_name;
              bairro = true;
            } else if (!bairro) {
              //if(strBairro != ""){
              //$scope.enderecoReversoBairro = strBairro;
              // }else{
              $scope.enderecoReversoBairro = "Não encontrado.";
              // }

            }
            if (arrAddress[ac].types[0] == "locality") {
              $scope.enderecoReversoCidade = arrAddress[ac].long_name;
              cidade = true;
            } else if (!cidade) {
              $scope.enderecoReversoCidade = "Não encontrado.";
            }

            if (arrAddress[ac].types[0] == "administrative_area_level_1") {
              $scope.enderecoReversoEstado = arrAddress[ac].short_name;
              estado = true;
            } else if (!estado) {
              $scope.enderecoReversoEstado = "Não encontrado.";
            }
          }
          if (!bairro &&
            strBairro !== $scope.enderecoReversoRua &&
            strBairro !== $scope.enderecoReversoCidade &&
            strBairro !== $scope.enderecoReversoEstado) {
            $scope.enderecoReversoBairro = strBairro;
          }

          $window.localStorage['rua'] = $scope.enderecoReversoRua;
          $window.localStorage['bairro'] = $scope.enderecoReversoBairro;
          $window.localStorage['cidade'] = $scope.enderecoReversoCidade;
          $window.localStorage['estado'] = $scope.enderecoReversoEstado;
          $window.localStorage['endereco'] = $scope.enderecoReverso;
          $window.localStorage['latlng'] = latlng;

          $scope.blinds();
          $scope.$apply();


        } else {
          infowindow.setContent('Endereço não encontrado');
          infowindow.open($scope.map, $scope.marker);
        }
      } else {
        infowindow.setContent('Geocoder falhou por: ' + status);
        infowindow.open($scope.map, $scope.marker);
      }
    });
  }

  var reset = function () {
    var inClass = document.querySelectorAll('.in');
    for (var i = 0; i < inClass.length; i++) {
      inClass[i].classList.remove('in');
      inClass[i].removeAttribute('style');
    }
    var done = document.querySelectorAll('.done');
    for (var i = 0; i < done.length; i++) {
      done[i].classList.remove('done');
      done[i].removeAttribute('style');
    }
    var ionList = document.getElementsByTagName('ion-list');
    for (var i = 0; i < ionList.length; i++) {
      var toRemove = ionList[i].className;
      if (/animate-/.test(toRemove)) {
        ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
      }
    }
  };


  $scope.blinds = function () {
    reset();
    document.getElementsByTagName('ion-list')[0].className += ' animate-blinds';
    setTimeout(function () {
      ionicMaterialMotion.blinds(); // ionic.material.motion.blinds(); //ionicMaterialMotion
    }, 200);
  };

  //$scope.blinds();
});