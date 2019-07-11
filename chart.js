if (window.tarkar == undefined) {
    window.tarkar = {}
}
(function(tarkar){
    if (tarkar == undefined) {
        tarkar = {};
    }

    if (tarkar.control == undefined) {
        tarkar.control = {};
    }
    
    tarkar.control.Chart = function(options){
        this.canvas = document.getElementById(options.id);
        if (this.canvas) {
            this.context = this.canvas.getContext("2d");
            this.points = options.points;
            this.tension = options.tension;
            this.isClosed = options.isClosed;
            this.numOfSegments = options.numOfSegments;
            this.showPoints = options.showPoints;
            this.colors = options.colors;
            this.xAxis = options.xAxis;
            this.start = 0;
            this.end = options.range;
            this.range = options.range;
        }
    }

    tarkar.control.Chart.prototype.drawChart = function() {
        var self = this;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.points.length; i++) {
            this.drawCurve(this.points[i], this.tension, this.isClosed, this.numOfSegments, this.showPoints, this.colors[i]);
        }
    }

    tarkar.control.Chart.prototype.drawCurve = function(points, tension, isClosed, numOfSegments, showPoints, color) {        
        this.context.beginPath();
        var _points = this.getCurvePoints(points, tension, isClosed, numOfSegments);
        this.drawLines(_points, color);
        this.context.moveTo(10,300);
        this.context.lineTo(1190, 300);
        this.context.moveTo(10,10);
        this.context.lineTo(10, 300);
        for (var i = 0; i <= this.xAxis.length; i++) {
            if (this.xAxis[i] + this.start > 3) {
                this.context.fillText(i, this.xAxis[i] + 8 + this.start, 320);
                this.context.moveTo(this.xAxis[i] + 10 + this.start, 300);
                this.context.lineTo(this.xAxis[i] + 10 + this.start, 305);
            }
        }        
        this.context.stroke();
    }

    tarkar.control.Chart.prototype.getCurvePoints = function(pts, tension, isClosed, numOfSegments) {
        tension = (typeof tension !== 'undefined') ? tension :  0.5;
        isClosed = isClosed ? isClosed : false;
        numOfSegments = numOfSegments ? numOfSegments : 16;

        var _pts = [], res = [], x, y, t1x, t2x, t1y, t2y, c1, c2, c3, c4, st, t, i;
        _pts = pts.slice(0);
        if (isClosed) {
            _pts.unshift(pts[pts.length - 1]);
            _pts.unshift(pts[pts.length - 2]);
            _pts.unshift(pts[pts.length - 1]);
            _pts.unshift(pts[pts.length - 2]);
            _pts.push(pts[0]);
            _pts.push(pts[1]);
        } else {
            _pts.unshift(pts[0]);
            _pts.unshift(pts[1]);
            _pts.push(pts[pts.length - 2]);
            _pts.push(pts[pts.length - 1]);
        }

        for (i = 2; i < (_pts.length - 4); i += 2) {
            if (true) {
                for (t = 0; t <= numOfSegments; t++) {
                    t1x = (_pts[i+2] - _pts[i-2]) * tension;
                    t2x = (_pts[i+4] - _pts[i]) * tension;

                    t1y = (_pts[i+3] - _pts[i-1]) * tension;
                    t2y = (_pts[i+5] - _pts[i+1]) * tension;

                    st = t / numOfSegments;

                    c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
                    c2 = 3 * Math.pow(st, 2) - 2 * Math.pow(st, 3);
                    c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
                    c4 = Math.pow(st, 3) - Math.pow(st, 2);
                    x = c1 * _pts[i] + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
                    y = c1 * _pts[i+1] + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;
                    if ((x + this.start) >= 10) {
                        res.push(x + this.start);
                        res.push(y);
                    }
                }
            }
        }
        return res;
    }

    tarkar.control.Chart.prototype.drawLines = function(pts, color) {
        this.context.strokeStyle = color;
        this.context.moveTo(pts[0], pts[1]);
        for (var i = 0; i < pts.length -1; i+=2) {
            this.context.lineTo(pts[i], pts[i+1]);
        }
    }

})(tarkar);