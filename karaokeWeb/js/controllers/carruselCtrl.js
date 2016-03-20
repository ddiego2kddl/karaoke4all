'use strict';

app.controller('carruselCtrl', function ($scope, $http, comunidadService,grabacionesService) {
	console.log("carrusel");
    comunidadService.getSongsBD().then(function(user){
        var songsTotal = user.data.slice(0); 
        $scope.path=path;
        
        //console.log(songsTotal);
		$scope.songs=user.data;
        $scope.songs.sort(function(a,b){return a.fecha - b.fecha}).reverse();
        $scope.songs.splice(5,$scope.songs.length);
        //console.log($scope.songs);
        grabacionesService.getGrabacionesBD().then(function(g){
            var grabaciones = g.data;
            grabaciones.sort(function(a,b){return a.id_song - b.id_song});
            var arraux=[];
            
            var aux = grabaciones[0].id_song; 
            var cont = 1;
            
            for(var i=0; i<grabaciones.length; i++){   
                
                if(i+1==grabaciones.length){
                    var vobj={};
                        vobj.id_song = aux;
                        vobj.cont = cont;
                        console.log(vobj);
                        arraux.push(vobj);
                }
                else{
                    if(aux != grabaciones[i+1].id_song ){
                        var vobj={};
                        vobj.id_song = aux;
                        vobj.cont = cont;
                        console.log(vobj);
                        arraux.push(vobj);
                        cont=1;
                        aux = grabaciones[i+1].id_song;
                    }
                    else{
                        cont++;
                    }
                    
                }
            }
            var i, j ;
            var auxarr=[];
             for(i=0;i<arraux.length-1;i++)
                  for(j=0;j<arraux.length-i-1;j++)
                       if(arraux[j+1].cont>arraux[j].cont){
                          auxarr=arraux[j+1];
                          arraux[j+1]=arraux[j];
                          arraux[j]=auxarr;
                        }
            $scope.songs2= [];
            for(var i=0; i<arraux.length;i++){
              for(var j=0; j<songsTotal.length;j++){
                if(arraux[i].id_song == songsTotal[j].id_song){
                    var auxSong = (songsTotal[j]);
                    auxSong.cont = arraux[i].cont;
                    $scope.songs2.push(auxSong);
                    j=$scope.songs.length+1;
                }
              }
            }
            console.log(grabaciones);

        });
        
	});

});

app.controller('torneosCtrl', function ($scope, $http) {
	console.log("torneos");

	$scope.test = function(){
		alert("test desde torneos");
	}
});




app.controller('estrellaCtrl', function ($scope, $http) {
	console.log("estrella");
});




app.controller('desafioCtrl', function ($scope, $http) {
	console.log("desafio");
});