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

    let width, height, center;
    let points = 5;
    let smooth = true;
    let path = new Paper.Path();
    let mousePos = Paper.view.center / 2;
    let pathHeight = isNaN(mousePos) ? Paper.view.center / 2 : mousePos.y;
    // console.log("pathHeight iniziale: " + pathHeight);

    path.fillColor = 'black';
    initializePath();

    function initializePath() {
        center = Paper.view.center;
        width = Paper.view.size.width;
        height = Paper.view.size.height / 2;
        path.segments = [];
        path.add(Paper.view.bounds.bottomLeft);
        for (let i = 1; i < points; i++) {
            let point = new Paper.Point(width / points * i,  center.y);
            path.add(point);
        }
        path.add(Paper.view.bounds.bottomRight);
        path.fullySelected = true;
    }

    Paper.view.onFrame = (event) => {
        pathHeight += (center.y - ( isNaN(mousePos) ? Paper.view.center / 2 : mousePos.y ) - pathHeight) / 10;

        console.log("pathHeight: " + pathHeight);
        // console.log("mousePos: " + mousePos);
        // console.log("centerY: " + center.y);

        for (let i = 1; i < points; i++) {
            let sinSeed = event.count + (i + i % 10) * 100;
            let sinHeight = Math.sin(sinSeed / 200) * pathHeight;
            let yPos = Math.sin(sinSeed / 100) * sinHeight + height;
            path.segments[i].point.y = yPos;
        }
        if (smooth)
            path.smooth({ type: 'continuous' });
    }

    Paper.view.onMouseMove = (event) => {
        console.log(event);
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