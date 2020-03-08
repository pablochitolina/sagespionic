// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-material', 'ngCordova'])
    .constant("myConfig", {
        "url": "http://10.1.1.4:3000/api/"
    });

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (ionic.Platform.isAndroid()) {
            window.addEventListener("native.hidekeyboard", function () {
                window.AndroidFullScreen.immersiveMode(false, false);
            });
        }
        //ionic.Platform.isFullScreen = false;

    });

})

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('cadastrar', {
            url: '/cadastrar',
            templateUrl: 'templates/cadastrar.html',
            controller: 'CadastrarCtrl'
        })
        .state('alteradados', {
            url: '/alteradados',
            templateUrl: 'templates/alteradados.html',
            controller: 'AlteraDadosCtrl'
        })
        .state('principal', {
            //url: '/principal/:email/:senha/:nome/:sobrenome/:_id',
            url: '/principal',
            abstract: true,
            templateUrl: 'templates/principal.html',
            controller: 'PrincipalCtrl'
        })
        .state('principal.tab_novos', {
            url: '/tab_novos',
            views: {
                'tab_novos': {
                    templateUrl: 'templates/tab_novos.html',
                    controller: 'TabNovosCtrl'
                }
            }
        })
        .state('principal.tab_atend', {
            url: '/tab_atend',
            views: {
                'tab_atend': {
                    templateUrl: 'templates/tab_atend.html',
                    controller: 'TabAtendCtrl'
                }
            }
        })
        .state('principal.tab_resolvidos', {
            url: '/tab_resolvidos',
            views: {
                'tab_resolvidos': {
                    templateUrl: 'templates/tab_resolvidos.html',
                    controller: 'TabResolvidosCtrl'
                }
            }
        })
        .state('chamadocadastro', {
            url: '/chamadocadastro',
            abstract: true,
            templateUrl: 'templates/chamadocadastro.html',
            controller: 'ChamadoCadastroCtrl'
        })
        .state('chamadocadastro.tab_img', {
            url: '/tab_img',
            views: {
                'tab_img': {
                    templateUrl: 'templates/tab_img.html',
                    controller: 'TabImgCtrl'
                }
            }
        })
        .state('chamadocadastro.tab_map', {
            url: '/tab_map',
            views: {
                'tab_map': {
                    templateUrl: 'templates/tab_map.html',
                    controller: 'TabMapCtrl'
                }
            }
        })
        .state('chamadocadastro.tab_desc', {
            url: '/tab_desc',
            views: {
                'tab_desc': {
                    templateUrl: 'templates/tab_desc.html',
                    controller: 'TabDescCtrl'
                }
            }
        })
        ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    $ionicConfigProvider.tabs.position("bottom");
});
