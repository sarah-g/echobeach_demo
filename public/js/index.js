var socket = io();

//var canvas = $("#canvas")[0];
//var context = canvas.getContext('2d');

$("#listen_container").hide();
$("#generate_container").hide();
$("#canvas_container").hide();
$("#button_container").hide();

function clearAll(){
    $("#updates").html('Ready...');
    $("#listen_container").hide();
    $("#generate_container").hide();
    $("#canvas_container").hide();
    $("#button_container").hide();
}

function setListening(){
    $("#updates").html('Recording sound...');
    $("#listen_container").show();
    $("#generate_container").hide();
    $("#canvas_container").hide();
    $("#button_container").hide();
}

function setGenerating(){
    $("#updates").html('Generating spectrogram...');
    $("#listen_container").hide();
    $("#generate_container").show();
    $("#canvas_container").hide();
    $("#button_container").hide();
}

function setSpecImage(info){
    $("#updates").html('Spectrogram complete');
    $("#listen_container").hide();
    $("#generate_container").hide();
    
    $("#spec_img").attr("src", info.filename);
    
    $("#canvas_container").show();
    $("#button_container").show();
    
    //var img = new Image();
    //img.src = 'data:image/png;base64,' + info.buffer;
        
    //ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
    //context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
}

$("#clear").click(function(){
    console.log('clearing data...');
    clearAll();
});

socket.on('listening', function(){
    console.log('Recording sound...');
    setListening();
});

socket.on('spectrogram', function(){
    //delay sending update
    setTimeout(function() {
        console.log('Generating spectrogram...');
        setGenerating();
    }, 2000);
    
});

socket.on("image", function(info) {
    //if (info.image) {
        console.log('Spectrogram complete');
        setSpecImage(info);
    //}
});
