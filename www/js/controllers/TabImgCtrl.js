app.controller('TabImgCtrl', function (myConfig, $scope, $window, $cordovaCamera, ionicMaterialInk, $cordovaFileTransfer, $ionicPopup, $cordovaFile, $ionicLoading, $http) {

  ionicMaterialInk.displayEffect();

  $scope.data = {};

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    console.log("deviceready");
    console.log(File);
    console.log(FileTransfer);
  }


  $scope.screenWidth = 'http://placehold.it/' + ($window.innerWidth - 32);
  $scope.imgSize = ($window.innerWidth - 32);

  //dados extra
  var iduser = $window.localStorage['iduser'];
  var email = $window.localStorage['email'];

  //dados mapa
  var rua = $window.localStorage['rua'];
  var bairro = $window.localStorage['bairro'];
  var cidade = $window.localStorage['cidade'];
  var estado = $window.localStorage['estado'];
  var endereco = $window.localStorage['endereco'];
  var latlng = $window.localStorage['latlng'];

  //dados imgSize
  var filePath = "";

  $scope.takePicture = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 800,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (sourcePath) {


      var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
      var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);

      console.log("Copying from : " + sourceDirectory + sourceFileName);
      console.log("Copying to : " + cordova.file.dataDirectory + iduser + "-" + sourceFileName);

      $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, iduser + "-" + sourceFileName).then(function (success) {
        $scope.imgURI = cordova.file.dataDirectory + iduser + "-" + sourceFileName;
        filePath = cordova.file.dataDirectory + iduser + "-" + sourceFileName;
      }, function (error) {
        console.dir(error);
      });

    }, function (err) {
      // error
      console.log(err);
    });

  }

  $scope.salvar = function (isValid) {
    if (isValid) {

      var _base64 = {

        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = _base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t },
        decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = _base64._utf8_decode(t); return t },
        _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t },
        _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t }
      }

      var auth = "Basic " + _base64.encode($window.localStorage['email'] + ":" + $window.localStorage['senha']);

      $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
      });

      var options = {
        fileKey: "foto",
        fileName: filePath.split("/").pop(),
        chunkedMode: false,
        mimeType: "image/jpg",
        headers: { 'Authorization': auth }
      };
      //console.log("filePath " + filePath);

      var server = myConfig.url + 'servicos/uploadimage';

      $cordovaFileTransfer.upload(server, filePath, options)
        .then(function (result) {

          console.log("filetransfer " + result.message);

          var link = myConfig.url + 'servico';

          $http.defaults.headers.common.Authorization = auth;
          $http.defaults.headers.common["Content-Type"] = 'application/json';

          $http.post(link, {
            filename: filePath.split("/").pop(),
            latlng: latlng,
            desc: $scope.data.descricao,
            data: new Date(),
            estado: estado,
            cidade: cidade,
            bairro: bairro,
            rua: rua,
            endereco: endereco,
            iduser: iduser

          }).then(function (res) {
            $ionicLoading.hide();

            //$scope.response = res.data.message;
            //console.log("res " + JSON.stringify(res));
            if (res.data.message === 'postServicoSuccess') {
              //console.log("res.servico " + JSON.stringify(res.data.servico));
              var alertPopup = $ionicPopup.alert({
                title: '<p><b>Feito! :)</b></p>',
                template: '<p>Novo chamado criado com sucesso!</p>'
              });

            } else {
              var alertPopup = $ionicPopup.alert({
                title: '<p><b>Oops! ;(</b></p>',
                template: '<p>Ocorreu um erro durante o cadastro do seu chamado!</p>' + res.data.message
              });
            }
          }, function (err) {
            // Error
            $ionicLoading.hide();
            console.log("ERROR POST: " + JSON.stringify(err));
          });

        }, function (err) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '<p><b>Oops! ;(</b></p>',
            template: '<p>Ocorreu um erro durante o cadastro do seu chamado!</p>'
          });
          console.log("ERROR FF: " + JSON.stringify(err));

        });

    } else {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Vish! :o',
        template: 'Dados incorretos!'
      });
    }
  };

});