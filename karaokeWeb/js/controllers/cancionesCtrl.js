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
app.controller('karaokeCtrl', ['$scope','grabacionesService','$modalInstance','$timeout','sessionService','$http','$q', function($scope,grabacionesService,$modalInstance,$timeout,sessionService,$http,$q){
    
    var video;
    var rec_media;
    var src2="p1.mp3";
	var mediaType = {audio:true};
    var blob2;
    var blobURL;
    

    
    var audioContainer = document.getElementById('audio-container');
    
	$scope.autoplay=false;
	$scope.srcVideo = path + songGlobal.url_letter;
    $scope.playing = true; //george con valor en false, arranca cuando ya se ha terminado la grabacin, para cambiar diseño y tal sin chuparte la cancion entera
    $scope.started = false;
    $scope.compartirCheck = true;

	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }
    $scope.stop= function(){
        video.pause();
        mediaRecorder.stopRecording(function(url) {
            audio.src = url;
            audio.download = 'Orignal.wav';
            //convertStreams(mediaRecorder.getBlob());
        });
        $scope.playing = false;
              
    }


    $scope.fullScreen = function(){
        video.requestFullscreen();
        //video.webkitExitFullscreen();   //salir de fullscreen
    }
    
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia  =   navigator.getUserMedia || 
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia || 
                                navigator.msGetUserMedia;

	var audiosContainer = document.getElementById('audioContainer');
    
    $scope.grabar= function(){
        video.play();
        $scope.started = true;
        var mediaConstraints = {
            audio: true
        };

        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

        function onMediaSuccess(stream) {
            mediaRecorder = RecordRTC(stream);
            console.log(mediaRecorder);
            mediaRecorder.startRecording();
            console.log(parseInt(video.duration));
        }
        function onMediaError(e) {
            console.error('media error', e);
        }
        //cuando comienza el video en el 1 segundo
        video.addEventListener("timeupdate", videoStart,false);
        function videoStart(){
            console.log("comenzar a grabar!!"); 
    
            video.removeEventListener('timeupdate', videoStart, false);
        }

        video.addEventListener("ended",function(){
            
            video.pause();
            $scope.playing = false;
            mediaRecorder.stopRecording(function(url) {
               audio.src = url;
               audio.download = 'Orignal.wav';
                console.log(mediaRecorder.getBlob());
                //convertStreams(mediaRecorder.getBlob());
                console.log(mediaRecorder.getBlob());
            });
           /* console.log(mediaRecorder);
            mediaRecorder.stopRecording();
            console.log(mediaRecorder.getBlob());
            convertStreams(mediaRecorder.getBlob());*/
                
            
    
            console.log("detenido, y grabacion completada!!");
            if (mediaRecorder) {
                console.log("detenido, y grabacion completada!!");
                //subir HHTTP request    
                $scope.$apply(function () {
                        $scope.playing = false;
                        video.webkitExitFullscreen();
                });
            }
        });

    }

    function esMal (e){
        console.error('media error',e);
    }

   $scope.$watch('srcVideo', function() {
       $("video").attr("src",$scope.srcVideo);
       video = document.getElementById("video");
       video.load();
   });

    
/*****   Parse Ogg ' ********/
        var workerPath = 'https://4dbefa02675a4cdb7fc25d009516b060a84a3b4b.googledrive.com/host/0B6GWd_dUUTT8WjhzNlloZmZtdzA/ffmpeg_asm.js';
        function processInWebWorker() {
            var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
            type: 'application/javascript'
            }));
            var worker = new Worker(blob);
            URL.revokeObjectURL(blob);
            return worker;
        }
        var worker;

    
    
    
    
    
    
    
    function convertStreams(audioBlob){
        var deferred = $q.defer();
        var promise = deferred.promise;
        
        var aab;
        var bufferReady;
        var workerReady;
        var posted;
        
        console.log(audioBlob);
        var fileReader = new FileReader();
                    fileReader.onload = function() {
                        aab = this.result;
                        postMessage();
                    };
        
        fileReader.readAsArrayBuffer(audioBlob);
        if (!worker) {
                        worker = processInWebWorker();
        }
        
        
        worker.onmessage = function(event) {
            var message = event.data;
            console.log(event.data);
                if (message.type == "ready") {
                    console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
                    workerReady = true;
                    //if (buffersReady)
                        postMessage();
                } else if (message.type == "stdout") {
                    //console.log(message.data);
                } else if (message.type == "start") {
                    //console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
                } else if (message.type == "done") {
                    //console.log(JSON.stringify(message));
                    
                    var result = message.data[0];
                    //console.log(JSON.stringify(result));
                    var blob = new Blob([result.data], {
                        type: 'audio/ogg'
                    });
                    console.log(JSON.stringify(blob));
                    PostBlob(blob);
                    console.log(blob);
                }
            
        };
        
        
        var postMessage = function() {
                        posted = true;
                        worker.postMessage({
                            type: 'command',
                            arguments: [
                                '-i', 'audio.wav', 
                                '-c:a', 'vorbis', 
                                '-b:a', '4800k', 
                                '-strict', 'experimental', 'output.mp4'
                            ],
                            files: [
                                {
                                    data: new Uint8Array(aab),
                                    name: "audio.wav"
                                }
                            ]
                        });
                    };
        
        
        
        function PostBlob(blob) {
           
            var audioOgg = document.createElement('audio');
            audioOgg.controls = true;

            var source = document.createElement('source');
            source.src = URL.createObjectURL(blob);
            source.type = 'audio/ogg; codecs=vorbis';
            audioOgg.appendChild(source);

            audioOgg.download = 'Converted Audio.ogg';
            console.log(audioOgg);
            //document.getElementById("audio-container").appendChild(audioOgg);
            console.log(audioOgg);
            //subir archivo
            return deferred.resolve(true);
        }
        
        return deferred.promise;
    
    }
    
    
    
    
    
    
    
    
    
    
    
    
   // eschar la grabacion
    var my_media;
    var semaforoPlayRecord=0;
    $scope.playRecord = function(){
        if (semaforoPlayRecord==0){
            my_media = new Media("p1.mp3",
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
        else{
            alert("mensaje modal con cargando");
            convertStreams(mediaRecorder.getBlob()).then(function(rsp){
                if (rsp){
                    alert("termino de subir... cerrar modal");
                    
                    //Upload! 
                }else{alert("Problemas con la subida de archivo");}
            });
            $modalInstance.close();
        
            
            
        }
    }

    $scope.upload = function(comentario) {  
        
        console.log(mediaRecorder.getBlob());
        console.log("uploading..");
        /*var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName="grabacion.ogg";
        options.mimeType="audio/ogg";

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
        */
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





