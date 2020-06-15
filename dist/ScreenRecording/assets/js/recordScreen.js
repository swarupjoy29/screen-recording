
document.getElementById('save-disk').disabled = true;
document.getElementById('btn-stop-recording').disabled = true;
if(!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
    var error = 'Your browser does NOT support the getDisplayMedia API.';
    document.querySelector('body').innerHTML = error;
    document.getElementById('btn-start-recording').style.display = 'none';
    document.getElementById('btn-stop-recording').style.display = 'none';
    document.getElementById('save-disk').style.display = 'none';
    throw new Error(error);
}

function invokeGetDisplayMedia(success, error) {
    var displaymediastreamconstraints = {
        video: {
            displaySurface: 'monitor', // monitor, window, application, browser
            logicalSurface: true,
            cursor: 'always' // never, always, motion
        }
    };

    // above constraints are NOT supported YET
    // that's why overridnig them
    displaymediastreamconstraints = {
        video: true
    };

    if(navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
    else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
}

function captureScreen(callback) {
    invokeGetDisplayMedia(function(screen) {
        addStreamStopListener(screen, function() {
            document.getElementById('btn-stop-recording').click();
        });
        callback(screen);
    }, function(error) {
        console.error(error);
        alert('Unable to capture your screen. Please check console logs.\n' + error);
    });
}

function getFileName(extension){
	var d = new Date();
	var year = d.getUTCFullYear();
	var month= d.getUTCMonth() + 1;
	var date = d.getUTCDate();
	return "recording-" + month + date + year+'.'+extension;
}

function stopRecordingCallback() {
    //video.src = video.srcObject = null;
  //  video.src = URL.createObjectURL(recorder.getBlob());
    
    recorder.screen.stop();
    //recorder.destroy();
    //recorder = null;

    document.getElementById('btn-start-recording').disabled = false;
}

var recorder; // globally accessible

document.getElementById("save-disk").onclick = function(){
	if(!recorder)  return alert("no recording found");
	var file = new File([recorder.getBlob()], getFileName('mp4'), {
		type : "video/webm\;codecs=h264"
	});
	invokeSaveAsDialog(file, file.name);
};

document.getElementById('btn-start-recording').addEventListener('click', function() {
    this.disabled = true;
    captureScreen(function(screen) {
        //video.srcObject = screen;

        recorder = RecordRTC(screen, {
            type: 'video',
            mimeType : 'video/webm\;codecs=h264',
            getNativeBlob : false
        });

        recorder.startRecording();

        // release screen on stopRecording
        recorder.screen = screen;

        document.getElementById('btn-stop-recording').disabled = false;
        document.getElementById('btn-start-recording').disabled = true;
    });
});

document.getElementById('btn-stop-recording').onclick = function() {
    this.disabled = true;
    document.getElementById('save-disk').disabled = false;
    document.getElementById('btn-stop-recording').disabled = true;
    recorder.stopRecording(stopRecordingCallback);
};

function addStreamStopListener(stream, callback) {
    stream.addEventListener('ended', function() {
        callback();
        callback = function() {};
    }, false);
    stream.addEventListener('inactive', function() {
        callback();
        callback = function() {};
    }, false);
    stream.getTracks().forEach(function(track) {
        track.addEventListener('ended', function() {
            callback();
            callback = function() {};
        }, false);
        track.addEventListener('inactive', function() {
            callback();
            callback = function() {};
        }, false);
    });
}