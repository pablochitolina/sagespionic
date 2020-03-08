app.controller('LoginCtrl', function (myConfig, $scope, $state, $window, $ionicHistory, $http, $ionicPopup, $timeout, ionicMaterialInk, $ionicLoading) {


    ionicMaterialInk.displayEffect();
    $scope.data = {};

    ionic.Platform.ready(function () {
        try {

            $timeout(function () {
                if ($window.localStorage['lembrar'] === "sim") {

                    $scope.data = { email: $window.localStorage['email'], senha: $window.localStorage['senha'] };

                    $scope.submit($window.localStorage['email'], $window.localStorage['senha'], true);

                }
            }, 100);

        }
        catch (err) {
            console.log("Error " + err.message);
        }
    });


    $scope.submit = function (email, senha, isChecked) {

        var _base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = _base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t },
            decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = _base64._utf8_decode(t); return t },
            _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t },
            _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t }
        }
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });

        //var link = 'https://www.sagesponline.com.br/api/user';
        var link = myConfig.url + 'user';
        var auth = "Basic " + _base64.encode(email + ":" + senha);
        $http.defaults.headers.common.Authorization = auth;
        $http.defaults.headers.common["Content-Type"] = 'application/json';
        $http.defaults.headers.common["email"] = email;

        $http.get(link)
            .success(function (data, status, headers, config) {
                $ionicLoading.hide();
                if (data.message === 'nouser') {
                    var alertPopup = $ionicPopup.alert({
                        title: '<p><b>Oops! ;(</b></p>',
                        template: '<p>Email não encontrado.</p>'
                    });
                }
                if (data.message === 'userinativo') {
                    var alertPopup = $ionicPopup.alert({
                        title: '<p><b>Oops! :|</b></p>',
                        template: "<p>Parece que sua conta ainda não foi ativada.<br/>Vá até seu email e click no link enviado pelo remetente 'Sagesp Online' para ativa-la.</p>"
                    });
                }
                if (data.message === 'success') {


                    if (isChecked) {
                        $window.localStorage['lembrar'] = "sim";
                    } else {
                        $window.localStorage['lembrar'] = "nao";
                    }

                    $window.localStorage['email'] = data.user.email;
                    $window.localStorage['senha'] = senha;
                    $window.localStorage['nome'] = data.user.nome;
                    $window.localStorage['sobrenome'] = data.user.sobrenome;
                    $window.localStorage['iduser'] = data.user._id;

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });

                    $state.go('principal.tab_novos');
                }

            })
            .error(function (data, status, headers, config) {
               //if (data === 'Unauthorized') {
                    var alertPopup = $ionicPopup.alert({
                        title: '<p><b>Oops! ;(</b></p>',
                        template: '<p>Email ou senha inválidos.</p>'
                    });
                //}
                console.log('status ' + status);

                $ionicLoading.hide();
            });


    };

    $scope.esqueceuSenha = function (isValid, email) {

        if (isValid) {

            $ionicLoading.show({
                template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
            });
            $scope.data = {};
            $scope.result = "";

            //var link = 'https://www.sagesponline.com.br/api/forgotPass';
            var link = myConfig.url + 'forgotPass';

            $http.defaults.headers.common["Content-Type"] = 'application/json';
            $http.defaults.headers.common["email"] = email;

            $http.get(link)
                .success(function (data, status, headers, config) {
                    $ionicLoading.hide();

                    if (data.message === 'nouser') {
                        var alertPopup = $ionicPopup.alert({
                            title: '<p><b>Oops! ;(</b></p>',
                            template: '<p>Email não encontrado.</p>'
                        });
                    }
                    if (data.message === 'userinativo') {
                        var alertPopup = $ionicPopup.alert({
                            title: '<p><b>Oops! :|</b></p>',
                            template: "<p>Parece que sua conta ainda não foi ativada.<br/>Antes de prosseguir vá até seu email e click no link enviado pelo remetente 'Sagesp Online' para ativa-la.</p>"
                        });
                    }
                    if (data.message === 'success') {
                        var alertPopup = $ionicPopup.alert({
                            title: '<p><b>Falta pouco! :)</b></p>',
                            template: '<p>Uma nova senha foi enviada para seu endereço de email.</p>'
                        });
                    }

                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: '<p><b>Oops! ;(</b></p>',
                        template: '<p>Ocorreu um erro durante sua recuperação de senha!<br/> Tente novamente mais tarde</p>' + res.data.message
                    });

                });


        } else {
            var alertPopup = $ionicPopup.alert({
                title: '<p><b>Um momento!</b></p>',
                template: '<p>Preencha um email válido para prosseguir.</p>'
            });
        }
    };


});