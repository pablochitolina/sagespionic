app.controller('AlteraDadosCtrl', function (myConfig, $scope, $http, $ionicActionSheet, $window, $timeout, $ionicLoading, $ionicPopup, $ionicHistory, $state) {


    var senha = $window.localStorage['senha'];
    var nome = $window.localStorage['nome'];
    var sobrenome = $window.localStorage['sobrenome'];
    var iduser = $window.localStorage['iduser'];

    $scope.data = {};
    $scope.lastpass = senha;
    $scope.data = { sobrenome: sobrenome, nome: nome };


    $scope.putdados = function (op) {

        if (op === "trocasenha") {
            senha = $scope.data.senha;
        } else if (op === "trocanome") {
            nome = $scope.data.nome;
            sobrenome = $scope.data.sobrenome;
        } else {
            return;
        }

        $scope.data = {};

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

        var auth = "Basic " + _base64.encode($window.localStorage['email'] + ":" + $window.localStorage['senha']);
        $http.defaults.headers.common.Authorization = auth;
        $http.defaults.headers.common["Content-Type"] = 'application/json';

        $http.put(link, {
            iduser: iduser,
            nome: nome,
            sobrenome: sobrenome,
            senha: senha
        })
            .success(function (data, status, headers, config) {
                $ionicLoading.hide();

                if (data.message === 'nouser') {
                    var alertPopup = $ionicPopup.alert({
                        title: '<p><b>Oops! ;(</b></p>',
                        template: '<p>Usuário não encontrado.</p>'
                    });
                }
                if (data.message === 'putUserSuccess') {

                    $window.localStorage['nome'] = nome;
                    $window.localStorage['sobrenome'] = sobrenome;
                    $window.localStorage['senha'] = senha;

                    actionSheet();

                }

            })
            .error(function (data, status, headers, config) {
                if (data === 'Unauthorized') {
                    var alertPopup = $ionicPopup.alert({
                        title: '<p><b>Oops! ;(</b></p>',
                        template: '<p>Email ou senha inválidos.</p>'
                    });
                }

                $ionicLoading.hide();
            });


    };




    $scope.voltar = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('login');

    };

    function actionSheet() {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            titleText: '<h2>Dados alterados com sucesso!</h2>',
            cancelText: '<b>Okay :)</b>',
            cancel: function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('principal.tab_novos');
            },
            buttonClicked: function (index) {
                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
            hideSheet();
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('principal.tab_novos');
        }, 2000);

    };

});



app.directive('nxEqualEx', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqualEx) {
                console.error('nxEqualEx expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqualEx, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('nxEqualEx', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('nxEqualEx', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.nxEqualEx);
                model.$setValidity('nxEqualEx', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});
