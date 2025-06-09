var hour = document.getElementById('hour');
var min = document.getElementById('min');
var sec = document.getElementById('sec');
var Dhour = document.getElementById('h');
var Dmin = document.getElementById('m');
var Dsec = document.getElementById('s');
var clc = document.getElementById('clock');

function StartClock(){
    
    var d = new Date();
    
    var hr = d.getHours();
    var mn = d.getMinutes();
    var second = d.getSeconds();

    var h = hr * 30 + mn / 2;
    var minute = 6 * mn;
    var sc = 6 * second;

    hour.style.transform = `rotate(${h}deg)`;
    min.style.transform = `rotate(${minute}deg)`;
    sec.style.transform = `rotate(${sc}deg)`;

    Dhour.innerHTML = hr +' : ';
    Dmin.innerHTML = mn + ' : ';
    Dsec.innerHTML = second;

};
function getColor(){
    var i = 0, rgb = [];

    for(i = 0;i < 3;i++){
        rgb[i] = Math.round(255 * Math.random());
    }
    return 'rgb(' + rgb.join(',') + ')';
}

function Setborder(){
    clc.style.border = `30px solid ${getColor()}`;
}

setInterval(StartClock,1000);
// setInterval(Setborder,1000);