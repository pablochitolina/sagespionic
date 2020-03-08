app.controller('PrincipalCtrl', function ($scope, $state, $window, $ionicHistory, ionicMaterialInk) {
    ionicMaterialInk.displayEffect();
/*
    console.log("email" + $window.localStorage['email']);
    console.log("senha" + $window.localStorage['senha']);
    console.log("auth" + $window.localStorage['auth']);
    console.log("nome" + $window.localStorage['nome']);
    console.log("sobrenome" + $window.localStorage['sobrenome']);
    console.log("_id" + $window.localStorage['_id']);*/

    var email = $window.localStorage['email'];
    var senha = $window.localStorage['senha'];
    var nome = $window.localStorage['nome'];
    var sobrenome = $window.localStorage['sobrenome'];
    var iduser = $window.localStorage['iduser'];

    $scope.$on('$ionicView.enter', function() {
        $scope.nomeUser = $window.localStorage['nome'] + " " + $window.localStorage['sobrenome'];

        email = $window.localStorage['email'];
        senha = $window.localStorage['senha'];
        nome = $window.localStorage['nome'];
        sobrenome = $window.localStorage['sobrenome'];
        iduser = $window.localStorage['iduser'];

    });

    $scope.sair = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        
        $window.localStorage['email'] = "";
        $window.localStorage['senha'] = "";
        $window.localStorage['nome'] = "";
        $window.localStorage['sobrenome'] = "";
        $window.localStorage['iduser'] = "";
        $window.localStorage['lembrar'] = "nao";

        $state.go('login');
    };

    $scope.novo = function () {
        $state.go('chamadocadastro.tab_map');
    };

    $scope.alterar = function () {
        $state.go('alteradados');
    };

});