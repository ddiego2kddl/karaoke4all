var app = angular.module('karaokeApp',['ui.router','ui.bootstrap','ngTable']);

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
        $stateProvider.state('menu.jugadores', {
              url: '/jugadores',
                templateUrl : 'partials/jugadores.html',
        });
        $stateProvider.state('menu.equipos', {
              url: '/equipos',
                templateUrl : 'partials/equipos.html',
        });
        $stateProvider.state('menu.partidos', {
              url: '/partidos',
                templateUrl : 'partials/partidos.html',
        });
        $stateProvider.state('menu.entrenamientos', {
              url: '/entrenamientos',
                templateUrl : 'partials/entrenamientos.html',
        });
});

//Remove acces to home page tiwhout authentication
app.run(function($rootScope,$location,loginService){
  var routePermission=['/menu','/menu/carrusel','/menu/clienteTabla','/menu/clienteNuevo'];
  $rootScope.$on('$stateChangeStart', function(){
      if ( (routePermission.indexOf($location.path()) != -1) )
      {
        var connected = loginService.islogged();
        connected.then(function(msg){
          // ***** msg tiene la cadena que devuelvo con print desde php **********
          if (!msg.data)
             $location.path('/login');
        });
      }
  });

});
