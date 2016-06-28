var pointsArray = document.getElementsByClassName('point');
var forEach = function() {    
    var revealPoint = function () {
        pointsArray[i].style.opacity = 1;
        pointsArray[i].style.transform = "scaleX(1) translateY(0)";
        pointsArray[i].style.msTransform = "scaleX(1) translateY(0)";
        pointsArray[i].style.WebkitTransform = "scaleX(1) translateY(0)";
    };
    for (i = 0; i < pointsArray.length; ++i){
        revealPoint();
    }    
};