'use strict';

app.controller('grabacionesCtrl', ['$scope','loginService','grabacionesService','cancionesService','comunidadService','$q','sessionService', function($scope,loginService,grabacionesService,cancionesService,comunidadService,$q,sessionService){
	$scope.path=path;
	//$scope.srcAudio = "http://karaoke4all.es/api/user/../../resources/songs/3/url_music.mp3";
	$scope.search = grabacionesService.getFilter();
	var users2,friends2;
	var init = function(){
		var grabaciones = grabacionesService.getGrabacionesBD(),
			songs = cancionesService.getSongsBD(),
			users = comunidadService.getUsersBD(),
			friends = comunidadService.getFriendsBD(sessionService.get('id')),
			estilos = cancionesService.getEstilosBD(),
			languages = cancionesService.getIdiomasBD();
		$q.all([grabaciones,songs,users,friends,estilos,languages]).then(function(dataArray){
			$scope.grabaciones = grabacionesService.makeGrabaciones(dataArray[0].data,dataArray[1].data, dataArray[2].data);
			$scope.friends = dataArray[3].data;
			$scope.estilos = dataArray[4].data;
			$scope.languages = dataArray[5].data;
			friends2=dataArray[3].data;
			users2=dataArray[2].data;
		})
	}

	init();

	$scope.sing = function(song){
		console.log("cantar song_id:"+song.id_song);
	}

	$scope.info = function(song){
		console.log("info de song_id:"+song.id_song);
	}

	$scope.goTo=function(id_user){
		var esFriend=false;
		var aux={};
		aux.extraDesc="";
		for (var i=0; i<friends2.length;i++){
			if (friends2[i].id_user==id_user){
				esFriend=true;
				aux=friends2[i];
			}
		}
		if (!esFriend){
			for (var i=0; i<users2.length;i++){
				if (users2[i].id_user==id_user){
					aux=users2[i];
				}
			}
		}
		if (esFriend)
			aux.extraDesc="Dejar de seguir";
		else
			aux.extraDesc="Seguir";

		comunidadService.modalUser(aux);
	}

	$scope.play = function(grab){
		if (grab.tipo == 'audio'){
			console.log("hola");
			$scope.srcAudio = path + grab.url;
		}
		else{
			$scope.srcAudio = "";
		}
	}

	$scope.$watch('srcAudio', function() {
       $("audio").attr("src",$scope.srcAudio);
   });


	var semaforo=-1;
	$scope.getComentarios=function(id_grabacion){
		if (semaforo!=id_grabacion){
			semaforo=id_grabacion;
			comunidadService.getPostIdbyComentarioBD(id_grabacion).then(function(post){
				var id_post=post.data[0].id_post;
				$scope.comentarios=[];
				var comentarios = comunidadService.getComentariosBD(id_post),
					users = comunidadService.getUsersBD();
				$q.all([comentarios,users]).then(function(dataArray){
					$scope.comentarios= dataArray[0].data;
					var arrayUsers = dataArray[1].data;
					for (var i=0; i<$scope.comentarios.length;i++){
						for (var j=0; j<arrayUsers.length;j++){
							if (parseInt($scope.comentarios[i].id_user) == parseInt(arrayUsers[j].id_user)){
								$scope.comentarios[i].username = arrayUsers[j].username;
								$scope.comentarios[i].url_foto = path+arrayUsers[j].url_foto;
								j=arrayUsers.length+1;
							}
						}
					}
				})
			})
		}
	}

	$scope.setComentario = function(id_grabacion){
		var idInput = "#"+id_grabacion;
		if ($(idInput).val() == "")
			alert("No puedes hacer comentarios en blanco");
		else {
			comunidadService.getPostIdbyComentarioBD(id_grabacion).then(function(post){
				var id_post=post.data[0].id_post;
				comunidadService.setComentarioBD(id_post,$(idInput).val()).then(function(data){
					semaforo=-1;
					$scope.getComentarios(id_post);
					$(idInput).val("");
				})
			})
			
		}
	}

}]);