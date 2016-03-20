var path = "http://karaoke4all.es/api/user/";
var pathFotos = "http://karaoke4all.es/resources/users";
var songGlobal;
var userGlobal;
var mediaRecorder;


var app = angular.module('karaokeApp',['ui.router','ui.bootstrap']);

app.config(function($stateProvider,$urlRouterProvider) {

        $urlRouterProvider.otherwise('/login')

        $stateProvider.state('login', {
              url: '/login',
              templateUrl : 'partials/login.html',
              controller  : 'loginCtrl'
        });
        $stateProvider.state('menu', {
              url: '/menu',
              templateUrl : 'partials/menu.html',
              controller  : 'menuCtrl'
        });
        //*********** HIJOS DE MENU ********///
        $stateProvider.state('carrusel', {
              parent: 'menu',
              url: '/carrusel',
              templateUrl : 'partials/carrusel.html',
              controller : 'carruselCtrl'

        });
        $stateProvider.state('torneos', {
              parent: 'menu',
              url: '/torneos',
              templateUrl : 'partials/torneos.html',
              controller : 'torneosCtrl'

        });
        $stateProvider.state('canciones', {
              parent: 'menu',
              url: '/canciones',
              templateUrl : 'partials/canciones.html',
              controller : 'cancionesCtrl'

        });
        $stateProvider.state('comunidad', {
              parent: 'menu',
              url: '/comunidad',
              templateUrl : 'partials/comunidad.html',
              controller : 'comunidadCtrl'

        });
        $stateProvider.state('grabaciones', {
              parent: 'menu',
              url: '/grabaciones',
              templateUrl : 'partials/grabaciones.html',
              controller : 'grabacionesCtrl'

        });
        $stateProvider.state('estrella', {
              parent: 'menu',
              url: '/estrella',
              templateUrl : 'partials/estrella.html',
              controller : 'estrellaCtrl'

        });
        //*********** HIJOS DE COMUNIDAD ********///
        $stateProvider.state('actividadComunidad', {
              parent: 'comunidad',
              url: '/actividadComunidad',
              templateUrl : 'partials/comunidad/actividadComunidad.html',
              controller : 'actividadComunidadCtrl'

        });
        $stateProvider.state('muroComunidad', {
              parent: 'comunidad',
              url: '/muroComunidad',
              templateUrl : 'partials/comunidad/muroComunidad.html',
              controller : 'muroComunidadCtrl'

        });
        $stateProvider.state('usuariosComunidad', {
              parent: 'comunidad',
              url: '/usuariosComunidad',
              templateUrl : 'partials/comunidad/usuariosComunidad.html',
              controller : 'usuariosComunidadCtrl'

        });
        $stateProvider.state('perfilComunidad', {
              parent: 'comunidad',
              url: '/perfilComunidad',
              templateUrl : 'partials/comunidad/perfilComunidad.html',
              controller : 'perfilComunidadCtrl'

        });
    
        $stateProvider.state('configuracionComunidad', {
              parent: 'comunidad',
              url: '/configuracionComunidad',
              templateUrl : 'partials/comunidad/configuracionComunidad.html',
              controller : 'configuracionComunidadCtrl'

        });
        $stateProvider.state('siguiendoComunidad', {
              parent: 'comunidad',
              url: '/siguiendoComunidad',
              templateUrl : 'partials/comunidad/siguiendoComunidad.html',
              controller : 'siguiendoComunidadCtrl'

        });
        $stateProvider.state('seguidoresComunidad', {
                  parent: 'comunidad',
                  url: '/seguidoresComunidad',
                  templateUrl : 'partials/comunidad/seguidoresComunidad.html',
                  controller : 'seguidoresComunidadCtrl'

        });
        $stateProvider.state('mensajesComunidad', {
                  parent: 'comunidad',
                  url: '/mensajesComunidad',
                  templateUrl : 'partials/comunidad/mensajesComunidad.html',
                  controller : 'mensajesComunidadCtrl'

        });

});

app.run(function ($rootScope, $location, loginService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        var connected = loginService.islogged();
        connected.then(function(msg){
            if (!msg.data){
                console.log("redireccionando a login");
                $location.path('/login');
                event.preventDefault();
            }
        });
    });
});