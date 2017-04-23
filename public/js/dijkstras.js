function PriorityQueue() {
    this._nodes = [];

    this.enqueue = function (priority, key) {
        this._nodes.push({key: key, priority: priority});
        this.sort();
    };
    this.dequeue = function () {
        return this._nodes.shift().key;
    };
    this.sort = function () {
        this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    };
    this.isEmpty = function () {
        return !this._nodes.length;
    };
}

/**
 * Pathfinding starts here
 */
function Graph() {
    var INFINITY = 1 / 0;
    this.vertices = {};

    this.addVertex = function (name, edges) {
        this.vertices[name] = edges;
    };

    this.shortestPath = function (start, finish) {
        var nodes = new PriorityQueue(),
            distances = {},
            previous = {},
            path = [],
            label = [],
            smallest, vertex, neighbor, alt;

        for (vertex in this.vertices) {
            label[vertex] = 0;
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            }
            else {
                distances[vertex] = INFINITY;
                nodes.enqueue(INFINITY, vertex);
            }

            previous[vertex] = null;
        }

        while (!nodes.isEmpty()) {
            smallest = nodes.dequeue();
            label[smallest] = 1;
            if (smallest === finish) {
                path = [];

                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }

                break;
            }

            if (!smallest || distances[smallest] === INFINITY) {
                continue;
            }

            for (neighbor in this.vertices[smallest]) {
                if (label[neighbor] == 0) {
                    alt = distances[smallest] + this.vertices[smallest][neighbor];
                }

                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            }
        }
        return path;
    };

    /**
     * Chuyển đổi dữ liệu đầu vào cho phù hợp với dijkstra library
     * @param  {array} names Tên các đỉnh của đồ thị
     * @param  {array} data  Dữ liệu của đồ thị (trọng số, liên thông..)
     * @return {void}
     */
    this.convertGraph = function (names, data) {
        for (var i = 0; i < names.length; i++) {
            var objectEdge = this.findVertext(i, names, data);
            this.addVertex(names[i], objectEdge);
        }
    };

    /**
     * Tìm các đỉnh có cạnh liên thông với đỉnh cho trước
     * @param  {int} pos   Vị trí index của đỉnh cần tìm các đỉnh có liên thông với đỉnh này
     * @param  {array} names Tên các đỉnh của đồ thị
     * @param  {array} data  Dữ liệu của đồ thị (trọng số, liên thông..)
     * @return {object}
     */
    this.findVertext = function (pos, names, data) {
        for (var i = pos; i < pos + 1; i++) {
            var objectEdge = {};
            for (var j = 0; j < names.length; j++) {
                if (data[i][j] !== 0) {
                    objectEdge[names[j]] = data[i][j];
                }
            }
        }
        return objectEdge;
    };

    /**
     * Trả về kết quả đường đi ngắn nhất tìm được
     * @param  {[str]} start  Đỉnh bắt đầu
     * @param  {[str]} finish Đỉnh kết thúc
     * @return {str}
     */
    this.printStrResult = function (start, finish) {
        return this.shortestPath(start, finish).concat(start).reverse().join("-->");
    };

    this.arrayResult = function (start, finish) {
        var _array = this.shortestPath(start, finish);
        _array.push(start);
        return _array;
    };
    /**
     * Mô phỏng tìm đường đi ngắn nhất
     * @param  {str} start         Đỉnh bắt đầu
     * @param  {str} finish        Đỉnh kết thúc
     * @param  callback Hàm tô màu đường đi
     * @param  coloringBlue  Hàm tô màu đường đi
     * @return {str}               Trả về chuỗi đường đi ngắn nhất
     */
    this.simulation = function (start, finish, callback, coloringBlue) {
        var nodes = new PriorityQueue(),
            distances = {},
            previous = {},
            path = [],
            label = [],
            strPath,
            smallest, vertex, neighbor, alt;

        for (vertex in this.vertices) {
            label[vertex] = 0;
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            }
            else {
                distances[vertex] = INFINITY;
                nodes.enqueue(INFINITY, vertex);
            }

            previous[vertex] = null;
        }

        while (!nodes.isEmpty()) {
            smallest = nodes.dequeue();
            label[smallest] = 1;

            // if (distances[smallest] !== 0) {
            //     //Lần ngược đường đi nhỏ nhất đã tính chi phí
            //     var temp = smallest;
            //     var arrayVertex = [smallest];
            //     while (temp != null) {
            //         if (previous[temp] != null) {
            //             arrayVertex.push(previous[temp]);
            //         }
            //         temp = previous[temp];
            //     }
            //
            //     console.log("Path: " + arrayVertex.reverse().join("->") + ",LOW cost: " + distances[smallest]);
            //     coloringBlue.push(arrayVertex);
            // }

            if (smallest === finish) {
                path = [];

                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }

                break;
            }

            if (!smallest || distances[smallest] === INFINITY) {
                continue;
            }

            var i = 1;
            //Tim canh ke nho nhat
            for (neighbor in this.vertices[smallest]) {
                if (label[neighbor] == 0) {
                    alt = distances[smallest] + this.vertices[smallest][neighbor];
                    //Lần ngược đường đi đã tính chi phí

                    var temp = smallest;
                    var arrayVertex = [neighbor, smallest];

                    while (temp != null) {
                        if (previous[temp] != null) {
                            arrayVertex.push(previous[temp]);
                        }
                        temp = previous[temp];
                    }

                    console.log("Path: " + arrayVertex.reverse().join("->") + ", cost: " + alt);
                    if (typeof callback === "function") {
                        // Call it, since we have confirmed it is callable​
                        var reverse = arrayVertex.reverse();
                        callback(reverse);
                    }

                    coloringBlue.push(arrayVertex);
                    i++;
                }

                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            }
        }

        if (path.indexOf(finish) < 0) {
            return "Can't found shortestPath";
        }
        return path;
    };
}