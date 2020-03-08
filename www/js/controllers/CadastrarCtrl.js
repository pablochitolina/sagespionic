app.controller('CadastrarCtrl', function (myConfig, $scope, $ionicHistory, $ionicPopup, $http, $ionicLoading, ionicMaterialInk, $state) {


    ionicMaterialInk.displayEffect();

    /*var uuid = "0";
    ionic.Platform.ready(function(){
    try {

        console.log("uuid " + uuid);
        uuid = $cordovaDevice.getUUID();

    }
    catch (err) {
        console.log("Error " + err.message);
        uuid = "error";
    }
    });*/

    $scope.data = {};

    $scope.submit = function (isValid) {

        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        if (isValid) {
            //var link = 'https://www.sagesponline.com.br/api/user';
            var link = myConfig.url + 'user';
            $http.defaults.headers.post["Content-Type"] = 'application/json';
            $http.post(link, {
                nome: $scope.data.nome,
                sobrenome: $scope.data.sobrenome,
                email: $scope.data.email,
                senha: $scope.data.senha

            }).then(function (res) {
                $ionicLoading.hide();

                //$scope.response = res.data.message;
                if (res.data.message === 'postUserSuccess') {
                    var alertPopup = $ionicPopup.alert({
                        title: '<p><b>Falta pouco! :)</b></p>',
                        template: '<p>Um link de ativação foi enviado para seu endereço de email.<br/>Abra-o para ativar sua conta.</p>'
                    });
                    $scope.voltar();
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: '<p><b>Oops! ;(</b></p>',
                        template: '<p>Ocorreu um erro durante seu cadastro!<br/> Tente novamente mais tarde</p>' + res.data.message
                    });
                }
            }, function (err) {
                // Error
                console.log(err);
            });
        } else {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Vish! :o',
                template: 'Dados incorretos!'
            });
        }


    };

    $scope.voltar = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('login');

    };


})
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