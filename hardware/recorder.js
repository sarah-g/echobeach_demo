/************************
*  Hardware elements
*************************/
var mraa = require('mraa'); //require mraa
var exec = require('child_process').exec;
var python = require('python-shell');
//var fs = require('fs');
//var chokidar = require('chokidar');

//shell command
var alsaCommand = 'arecord -D hw:2,0 -f S16_LE -r 192 -d 3 ';

//hardware
var led = new mraa.Gpio(14); //LED hooked up to digital pin 14 (or built in pin on Intel Galileo Gen2 as well as Intel Edison)
led.dir(mraa.DIR_OUT); //set the gpio direction to output
led.write(0);

var button = new mraa.Gpio(15); //setup digital read on Digital pin #16 (D3)
button.dir(mraa.DIR_IN); //set the gpio direction to input
button.isr(mraa.EDGE_RISING, pressed);
var pressed = false;

//mainLoop();
console.log("Bat recorder ready...");
setInterval(function(){var pin=button.getPin()}, 10000);

function pressed(){

    console.log("button pressed!");
    
    if(!pressed){
		pressed = true;

    console.log("recording started...");
    led.write(1); //if ledState is true then write a '1' (high) otherwise write a '0' (low)
    
    //send update to parent
    process.send('listening');
    
    var timestamp = (new Date).getTime();
    var newDirPath = "/media/sdcard/recordings/recording-"+timestamp;
    var mkdirCommand = "mkdir "+newDirPath;
    
    //create new recording in subdirectory
    exec(mkdirCommand, function callback(error, stdout, stderr){
        if(error){
            console.log("Error making new directory: "+error);
        }else{
            
            //create new file watcher for following subdirectory
            //createWatcher(newDirPath);
            
            //set filename with date/time
            var filename = newDirPath+"/recording-"+timestamp+".wav";
        
            //make 5 second recording
            var recordCommand = alsaCommand+filename;
            exec(recordCommand, function (error, stdout, stderr){
                if(error){
                    console.log("Error making new recording: "+error);
                }else{
                    console.log("recording finished");
                    //led.write(0); //if ledState is true then write a '1' (high) otherwise write a '0' (low)
                    
                    runPythonScript(filename);
                }
            });
        }
    });

	}

}

/*function createWatcher(directory){
    var watcher = chokidar.watch(directory, {
        ignored: /[\/\\]\./, 
        persistent: true
    });
    
    //watcher.on('add', path => console.log(`File ${path} has been added`));
    watcher.on('add', function(path) {
        console.log('File', path, 'has been ADDED');

        fs.stat(path, function (err, stat) {
            if (err){
                console.log('Error watching file for copy completion. ERR: ' + err.message);
                console.log('Error file not processed. PATH: ' + path);
            } else {
                console.log('File write started...');
                setTimeout(checkFileWriteComplete, 1000, path, stat);
            }
        });
    });
}

function checkFileWriteComplete(path, prev) {
    fs.stat(path, function (err, stat) {
        if (err) {
            throw err;
        }
        if (stat.mtime.getTime() === prev.mtime.getTime()) {
            console.log('File write complete => beginning processing');
            runPythonScript(path);
        }
        else {
            setTimeout(checkFileWriteComplete, 1000, path, stat);
        }
    });
}*/


function runPythonScript(filename)
{
    console.log("processing recording...");
    
    process.send('spectrogram');
    
    var options = {
        scriptPath: '/node_app_slot/python_scripts',
        args: [filename]
    };
    
    //python.run('read_audio.py', options, function (err, results) {
    python.run('gen_spectrogram.py', options, function (err, results) {
        if (err) throw err;
        //console.log('results: %j', results);
        
        //print out all results from python script
        if(results != null){
            for(var i=0; i<results.length; i++){
                console.log(results[i]);
            }
        }
        
        console.log('finished');
        
        process.send(filename.slice(0,-4) + '.png');
 	
	led.write(0);

	pressed = false;
    });
}

/*function mainLoop()
{
    //main loop running to keep program alive   
    setTimeout(mainLoop,1000); //call the indicated function after 1 second (1000 milliseconds)
}*/
    

/*exports.start = function() //
{   
    //start mainLoop function for recorder
    mainLoop();
}*/
