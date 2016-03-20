'use strict';

app.controller('cancionesCtrl', ['$scope','cancionesService','$q', function($scope,cancionesService,$q){
	$scope.path=path;
	$scope.search=[];

	var init = function(){
		var songs = cancionesService.getSongsBD(),
			estilos = cancionesService.getEstilosBD(),
			idiomas = cancionesService.getIdiomasBD();
		$q.all([songs,estilos,idiomas]).then(function(dataArray){
			$scope.songs = dataArray[0].data;
			$scope.estilos = dataArray[1].data;
			$scope.idiomas = dataArray[2].data;
		})
	}

	init();

	$scope.play = function(song){
			$scope.srcAudio = path + song.url_music;
	}

	$scope.cleanSearch=function(){
		$scope.search=[];
	}


    $scope.modalSong = function(song){
    	$scope.srcAudio = "";
   		cancionesService.modalSong('songModalCtrl','partials/karaoke/cancionModal.html',song);
    }

	$scope.$watch('srcAudio', function() {
        $("audio").attr("src",$scope.srcAudio);
    });

}]);
/////////////////////////////////
///// CTRL MODAL CANCION  ///////
/////////////////////////////////
app.controller('songModalCtrl', ['$scope','cancionesService','$modalInstance','comunidadService','sessionService','grabacionesService','$location', function($scope,cancionesService,$modalInstance,comunidadService,sessionService,grabacionesService,$location){
   	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }

    $scope.song=songGlobal;
    $scope.path=path;

	$scope.sing = function(modo,friend){
		songGlobal.modo="modo";
		if (modo=='reto'){
			if ($scope.userReto==null || $scope.userReto=="")
				alert("Debes de elegir a un amigo de la lista");
			else
				alert("Retando a: "+$scope.userReto+"\n\nNO DISPONIBLE EN ESTE MOMENTO");
		}
		else{
			 $modalInstance.dismiss('cancel');
			cancionesService.modalSong('karaokeCtrl','partials/karaoke/karaokeModal.html',songGlobal);
		}
	}


    $scope.play = function(){
			$scope.srcAudio = path + songGlobal.url_music;
	}

	$scope.$watch('srcAudio', function() {
        $("#audio2").attr("src",$scope.srcAudio);
    });

    $scope.play();

    //chekeando las puntuaciones
    cancionesService.getPuntosSongBD(songGlobal.id_song).then(function(points){
		$scope.highScore = 0;
		$scope.numPuntuadas = 0;
		$scope.myScore = 0;

    	if (points.data.length>0){
    		var aux=0;
    		for (var i=0; i<points.data.length;i++){
    			if (aux<points.data[i].points){
    				aux=points.data[i].points;
    				comunidadService.getUserBD(points.data[i].id_user).then(function(userScore){
    					$scope.userScore=userScore.data[0];
    				})
    			}
    			if (sessionService.get('id') == parseInt(points.data[i].id_user))
    				$scope.myScore=points.data[i].points;
    		}
    		$scope.highScore = aux;
    		$scope.numPuntuadas = points.data.length;
    	}
    });

    //chekeando el numero de grabaciones
    cancionesService.countGrabacionesSongBD(songGlobal.id_song).then(function(grab){
    	$scope.numGrab=grab.data;
    	if (grab.data>0)
    		$scope.verGrab=true;
    	else
    		$scope.verGrab=false;
    });

    comunidadService.getFriendsBD(sessionService.get('id')).then(function(friends){
    	friends.data.shift(); //remove first (must be 0 -- karaoke4allboot)
    	$scope.friends=friends.data;
    })

    //checkActividad
    cancionesService.countPostsSongBD(songGlobal.id_song).then(function(act){
    	$scope.numActv=act.data;
    })

    $scope.gotoGrabaciones = function(){
    	var search={};
    	search.id_song=songGlobal.id_song;
    	grabacionesService.setFilter(search);
        $modalInstance.dismiss('cancel');
    	$location.path('/menu/grabaciones');
    }


    $scope.gotoUser=function(user){
        console.log("1");
        var esFriend=false;
        var aux={};
        aux=user;
        aux.extraDesc="";
        comunidadService.getFriendsBD(user.id_user).then(function(friends){
            var friends2=friends.data;
            for (var i=0; i<friends2.length;i++){
                if (friends2[i].id_user==aux.id_user){
                    esFriend=true;
                }
            }
            if (esFriend)
                aux.extraDesc="Dejar de seguir";
            else
                aux.extraDesc="Seguir";

            comunidadService.modalUser(aux);
        })

    }

}]);








/////////////////////////////////
///// KARAOKE CTRL CANTAR ///////
/////////////////////////////////
app.controller('karaokeCtrl', ['$scope','grabacionesService','$modalInstance','$timeout','sessionService','$http', function($scope,grabacionesService,$modalInstance,$timeout,sessionService,$http){
    var rec_media;
    var src2="p1.mp3";
	$scope.autoplay=false;
	$scope.srcVideo = path + songGlobal.url_letter;
    $scope.playing = true; //george con valor en false, arranca cuando ya se ha terminado la grabacin, para cambiar diseño y tal sin chuparte la cancion entera
    $scope.started = false;
    $scope.compartirCheck = true;

	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }
    $scope.stop= function(){
        if (rec_media) {
            video.pause();
            rec_media.stopRecord();
        }
        $modalInstance.dismiss('cancel');
    }

    $scope.fullScreen = function(){
        video.webkitEnterFullScreen();
        //video.webkitExitFullscreen();   //salir de fullscreen
    }



    var video;
    $scope.grabar= function(){
        video.play();
        $scope.started = true;

        //cuando comienza el video en el 1 segundo
        video.addEventListener("timeupdate", videoStart,false);
        function videoStart(){
            console.log("comenzar a grabar!!");
            rec_media = new Media(src2);
            rec_media.startRecord();
            video.removeEventListener('timeupdate', videoStart, false);
        }

        //FUNCIONA EN TERMINAR DE SONAR LA CANCION SALTA --> meter aqui final de grabacion, y nuevo modal para guardar resultado
        video.addEventListener("ended",function(){
            if (rec_media) {
                rec_media.stopRecord();
                console.log("detenido, y grabacion completada!!");
                $scope.$apply(function () {
                        $scope.playing = false;
                        video.webkitExitFullscreen();
                });
            }
        });

    }

   $scope.$watch('srcVideo', function() {
       $("video").attr("src",$scope.srcVideo);
       console.log("srcvideo");
       video = document.getElementById("video");
       video.load();
   });

   // eschar la grabacion
    var my_media;
    var semaforoPlayRecord=0;
    $scope.playRecord = function(){
        if (semaforoPlayRecord==0){
            my_media = new Media("file:///sdcard/p1.mp3",
                // success callback
                function () { console.log("playAudio():Audio Success"); },
                // error callback
                function (err) { console.log("playAudio():Audio Error: " + err); }
            );
            semaforoPlayRecord=1;
        }     
        my_media.play();
    }

    $scope.stopRecord = function(){       
        my_media.stop();
    }

    $scope.pauseRecord = function(){       
        my_media.pause();
    }

    $scope.compartir = function(){
        console.log("compartir");
        if ($scope.comentario == null || $scope.comentario == ""){
            alert("Debes de escribir un comentario para tu grabacion");
        }
        else if ($scope.comentario.length<5){
            alert("Comentario demasiado corto, minimo 5 caracteres");
        }
        else
            $scope.upload($scope.comentario);
    }

    $scope.upload = function(comentario) {    
        console.log("uploading..");
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName="grabacion.mp3";
        options.mimeType="audio/mp3";

        var params = {};
        params.value1 = parseInt(sessionService.get('id'));
        params.value2 = sessionService.get('token');
        params.value3 = songGlobal.id_song;
        params.value4 = "audio"; // "video"
        params.value5 = comentario; //comment

        options.params = params;
        options.chunkedMode = false;

        var ft = new FileTransfer();
        ft.upload("mnt/sdcard/p1.mp3", path + "uploadGrabacion.php", win, fail, options);
    }

    function win(r) {
          console.log("Code = " + r.responseCode.toString()+"\n");
          console.log("Response = " + r.response.toString()+"\n");
          console.log("Sent = " + r.bytesSent.toString()+"\n");
          alert("Grabacion Subida y Compartida con Exito!!");
          my_media.stop();
          $modalInstance.dismiss('cancel');
    }

    function fail(error) {
           console.log("An error has occurred: Code = "+error.code);
    };




}]);





