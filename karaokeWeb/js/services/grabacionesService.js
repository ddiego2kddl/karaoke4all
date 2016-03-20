app.service('grabacionesService', function($http,$q,sessionService){
	//********* TODAS LAS GRABACIONES *********
    this.getGrabacionesBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
    	return $http.post(path+'getGrabacionesAll.php',id);
    }

    //*** CONSTRUCTOR DE CLASE ACTIVIDAD PARA MOSTRAR *****
    this.Grabacion = function(grabBD){
        var grab={};

        grab.id_grabacion = grabBD.id_grabacion;
        grab.id_user = grabBD.id_user; //
        grab.id_song = grabBD.id_song;//
        grab.fecha = grabBD.fecha;
        grab.tipo = grabBD.tipo;
        if (grab.tipo=="audio")
            grab.glyph = true;
        grab.url = grabBD.url_file;
        grab.desc = grabBD.comment;

        grab.user_name=""; //
        grab.user_foto=""; //

        grab.song_title="";//
        grab.song_language="";
        grab.song_artist="";
        grab.song_estilo="";

        return grab;
    }

    var search = {};
    this.setFilter = function(opciones){
        search=opciones;
    }
    this.getFilter = function(){
        var aux = search;
        search = {};
        return aux;
    }

    this.makeGrabaciones = function(grabaciones,songs,users){
        var grabacionesShow = new Array();
        for (var i=0; i<grabaciones.length; i++){
            var temp = this.Grabacion(grabaciones[i]);

            for (var j=0; j<songs.length; j++){
                if (temp.id_song == songs[j].id_song){
                    temp.song_title = songs[j].title;
                    temp.song_language = songs[j].language;
                    temp.song_artist = songs[j].artist;
                    temp.song_estilo = songs[j].style;
                    j=songs.length +1;
                }
            }

            for (var j=0; j<users.length; j++){
                if (temp.id_user == users[j].id_user){
                    temp.user_name = users[j].username;
                    temp.user_foto = users[j].url_foto;
                }
            }


            grabacionesShow.push(temp);
        }
        return grabacionesShow;
    }
    this.convertStreams=function(audioBlob,worker){
        
        worker.onmessage = function(event) {
            var message = event.data;
            console.log(event.data);
                if (message.type == "ready") {
                    //console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
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
            alert("holanda ke talca")
        }
        
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
        
        

        
        

        
        return deferred.promise;
    
    }
 


});