var pointsArray = document.getElementsByClassName('point');
var forEach = function(points) {
    var revealPoint = function(index) {
        points[index].style.opacity = 1;
        points[index].style.transform = "scaleX(1) translateY(0)";
        points[index].style.msTransform = "scaleX(1) translateY(0)";
        points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
    };
    for(i = 0; i < pointsArray.length; ++i) {
        revealPoint(i);
    }
};