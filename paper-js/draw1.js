import Paper from "paper";

const draw1 = () => {
//   let myPath = new Paper.Path();

//   Paper.view.onMouseDown = (event) => {
//     myPath.strokeColor = "black";
//     myPath.strokeWidth = 5;
//   };

//   Paper.view.onMouseDrag = (event) => {
//     myPath.add(event.point);
//   };

//   Paper.view.draw();

    var width, height, center;
    var points = 10;
    var smooth = true;
    var path = new Paper.Path();
    var mousePos = Paper.view.center / 2;
    var pathHeight = mousePos.y;
    path.fillColor = 'black';
    initializePath();

    function initializePath() {
        console.log(Paper.view.center);
        console.log(Paper.view.size.width);
        console.log(Paper.view.size.height);

        center = Paper.view.center;
        width = Paper.view.size.width;
        height = Paper.view.size.height / 2;
        path.segments = [];
        path.add(Paper.view.bounds.bottomLeft);
        for (var i = 1; i < points; i++) {
            var point = new Paper.Point(width / points * i, center.y);
            path.add(point);
        }
        path.add(Paper.view.bounds.bottomRight);
        path.fullySelected = true;
    }

    Paper.view.onFrame = (event) => {
        pathHeight += (center.y - mousePos.y - pathHeight) / 10;
        for (var i = 1; i < points; i++) {
            var sinSeed = event.count + (i + i % 10) * 100;
            var sinHeight = Math.sin(sinSeed / 200) * pathHeight;
            var yPos = Math.sin(sinSeed / 100) * sinHeight + height;
            path.segments[i].point.y = yPos;
        }
        if (smooth)
            path.smooth({ type: 'continuous' });
    }

    Paper.view.onMouseMove = (event) => {
        mousePos = event.point;
    }

    // Paper.view.onMouseDown = (event) => {
    //     smooth = !smooth;
    //     if (!smooth) {
    //         // If smooth has been turned off, we need to reset
    //         // the handles of the path:
    //         for (var i = 0, l = path.segments.length; i < l; i++) {
    //             var segment = path.segments[i];
    //             segment.handleIn = segment.handleOut = null;
    //         }
    //     }
    // }

    // Reposition the path whenever the window is resized:
    Paper.view.onResize = (event) => {
        initializePath();
    }
};

export default draw1;