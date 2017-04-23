$(document).ready(function () {
    var nodeList = [];
    var linkDataArray = [];
    var bidirectional = true;
    var isAuto = false;
    var index = 1;

    // var names = [
    // "A", "B", "C", "D", "E", "F", "G", "H"
    // ];
    // var data = [
    //     [0, 7, 8, 0, 0, 0, 0, 0],
    //     [7, 0, 0, 0, 0, 2, 0, 0],
    //     [8, 0, 0, 0, 0, 6, 4, 0],
    //     [0, 0, 0, 0, 0, 8, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 1],
    //     [0, 2, 6, 8, 0, 0, 9, 3],
    //     [0, 0, 4, 0, 0, 9, 0, 0],
    //     [0, 0, 0, 0, 1, 3, 0, 0]
    // ];

    var names = [];
    var data = [];

    var $$ = go.GraphObject.make;  // for conciseness in defining templates
    var myDiagram =
        $$(go.Diagram, "myDiagramDiv", // must be the ID or reference to div
            {
                initialAutoScale: go.Diagram.UniformToFill,
                padding: 10,
                contentAlignment: go.Spot.Center,
                layout: $$(go.ForceDirectedLayout, {defaultSpringLength: 10}),
                maxSelectionCount: 2
            });

    // define the Node template
    myDiagram.nodeTemplate =
        $$(go.Node, "Horizontal",
            {
                locationSpot: go.Spot.Center,  // Node.location is the center of the Shape
                locationObjectName: "SHAPE",
                selectionAdorned: false,
                // selectionChanged: nodeSelectionChanged
            },
            $$(go.Panel, "Auto",
                $$(go.Shape, "Ellipse",
                    {
                        name: "SHAPE",
                        fill: "lightgray",  // default value, but also data-bound
                        stroke: "transparent",  // modified by highlighting
                        strokeWidth: 2,
                        desiredSize: new go.Size(60, 60),
                        portId: ""
                    },  // so links will go to the shape, not the whole node
                    new go.Binding("fill", "isSelected", function (s, obj) {
                        return s ? "blue" : obj.part.data.color;
                    }).ofObject()),
                $$(go.TextBlock,
                    new go.Binding("text", "name", function (d) {
                        return d;
                    }))),
            $$(go.TextBlock,
                {
                    font: "bold 11pt helvetica, bold arial, sans-serif",
                    editable: false  // editing the text automatically updates the model data
                },
                new go.Binding("text").makeTwoWay()));

    // define the Link template
    myDiagram.linkTemplate =
        $$(go.Link,
            {
                selectable: true,      // links cannot be selected by the user
                layerName: "Background"  // don't cross in front of any nodes
            },
            $$(go.Shape,  // this shape only shows when it isHighlighted
                {isPanelMain: true, stroke: null, strokeWidth: 5},
                new go.Binding("stroke", "isHighlighted", function (h) {
                    return h ? "blue" : null;
                }).ofObject()),
            $$(go.Shape,
                // mark each Shape to get the link geometry with isPanelMain: true
                {isPanelMain: true, stroke: "black", strokeWidth: 1},
                new go.Binding("stroke", "color")),
            $$(go.Shape, {toArrow: "Standard"}),
            $$(go.TextBlock, new go.Binding("text"), {segmentOffset: new go.Point(0, -10)})
        );

    // generateGraph();
    function generateGraph() {
        var nodeDataArray = [];
        for (var i = 0; i < names.length; i++) {
            nodeDataArray.push({key: i, name: names[i], color: go.Brush.randomColor(128, 240)});
        }

        var num = nodeDataArray.length;
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < i; j++) {
                if (data[i][j] != 0) {
                    linkDataArray.push({
                        from: j,
                        to: i,
                        color: go.Brush.randomColor(0, 127),
                        text: data[i][j]
                    });
                }
            }
        }

        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    }

    //init(); // run graph

    $("input[name='optradio']").change(function () {
        if ($(this).val() == 1) {
            bidirectional = true;
            // define the Link template
            myDiagram.linkTemplate =
                $$(go.Link,
                    {
                        selectable: true,      // links cannot be selected by the user
                        curve: go.Link.Bezier,
                        layerName: "Background"  // don't cross in front of any nodes
                    },
                    $$(go.Shape,  // this shape only shows when it isHighlighted
                        {isPanelMain: true, stroke: null, strokeWidth: 5},
                        new go.Binding("stroke", "isHighlighted", function (h) {
                            return h ? "blue" : null;
                        }).ofObject()),
                    $$(go.Shape,
                        // mark each Shape to get the link geometry with isPanelMain: true
                        {isPanelMain: true, stroke: "black", strokeWidth: 1},
                        new go.Binding("stroke", "color")),
                    $$(go.Shape, {toArrow: "Standard"}),
                    $$(go.TextBlock,
                        new go.Binding("text"))
                );
        } else {
            bidirectional = false;
            // define the Link template
            myDiagram.linkTemplate =
                $$(go.Link,
                    {
                        selectable: true,      // links cannot be selected by the user
                        curve: go.Link.Bezier,
                        layerName: "Background"  // don't cross in front of any nodes
                    },
                    $$(go.Shape,  // this shape only shows when it isHighlighted
                        {isPanelMain: true, stroke: null, strokeWidth: 5},
                        new go.Binding("stroke", "isHighlighted", function (h) {
                            return h ? "blue" : null;
                        }).ofObject()),
                    $$(go.Shape,
                        // mark each Shape to get the link geometry with isPanelMain: true
                        {isPanelMain: true, stroke: "black", strokeWidth: 1},
                        new go.Binding("stroke", "color")),
                    $$(go.TextBlock,
                        new go.Binding("text"))
                );
        }
    });

    $('#addNote').click(function (event) {
        var name = $('#name').val();
        var node = {
            "name": name
        };
        createNode(node); //create node
        //$('#frmAddNote').modal('hide');
    });

    $('#clear').click(function (event) {
        linkDataArray = nodeList = [];
        isAuto = false;
        myDiagram.model = new go.GraphLinksModel([], []);
        $('#from').empty();
        $('#to').empty();
    });

    $('#autoGenerate').click(function (event) {
        names = [];
        data = [];
        linkDataArray = [];
        isAuto = true;
        var num = $('#numberAuto').val();
        num = num ? num : 10;
        for (var i = 0; i < num; i++) {
            names[i] = i;
        }

        for (var i = 0; i < num; i++) {
            data[i] = [];
            for (var j = 0; j < num; j++) {
                var random = Math.floor(Math.random() * 10);
                if (random <= 2) {
                    data[i][j] = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
                } else {
                    data[i][j] = 0;
                }
            }
        }

        generateGraph();
    });

    $('#linkNode').click(function (event) {
        var from = $('#from').val();
        var to = $('#to').val();
        var value = $('#value').val();

        var nodeDataArray = myDiagram.model.nodeDataArray;

        if (to && from) {
            linkDataArray.push({
                from: from,
                to: to,
                color: go.Brush.randomColor(0, 127),
                text: (value) ? value : null
            });
        }

        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    });

    function createNode(node) {
        for (var key in nodeList) {
            if (nodeList[key].name == node.name) {
                return false;
            }
        }

        var nodeDataArray = [];
        nodeList.push(node);
        for (var i = 0; i < nodeList.length; i++) {
            nodeDataArray.push({
                name: nodeList[i].name,
                key: i,
                color: go.Brush.randomColor(128, 240)
            });
        }

        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        addNodeToSelect(nodeDataArray);
    }

    function addNodeToSelect(nodes) {
        $('#from').empty();
        $('#to').empty();

        $.each(nodes, function (key, value) {
            $('#from').append($("<option></option>")
                .attr("value", value.key)
                .text(value.name));

            $('#to').append($("<option></option>")
                .attr("value", value.key)
                .text(value.name));
        });
    }

    /**
     * Highlight a particular path, a List of Nodes. Color Blue
     * @param  {array} List path string
     * @return {void}
     */
    function highlightPath(listNode) {

        var path = listHighlightPath(listNode);
        for (var i = 0; i < path.count - 1; i++) {
            var f = path.elt(i);
            var t = path.elt(i + 1);
            index = i;

            f.findLinksTo(t).each(function (l) {
                l.isHighlighted = true;
            });

            t.findLinksTo(f).each(function (l) {
                l.isHighlighted = true;
            });
        }
    }

    /**
     * Tạo danh sách các đường liên thông cần được Highlight
     * @param  {array} strListNode Chuỗi các node cần được Highlight
     * @return {void}
     */
    function listHighlightPath(listNode) {
        var path = new go.List();
        for (var i = 0; i < listNode.length; i++) {
            var nit = myDiagram.nodes;
            while (nit.next()) {
                var n = nit.value;
                if (n.data.name == listNode[i]) {
                    path.add(n);
                }
            }
        }
        return path;
    }

    /**
     * highlightPathPrimary a particular path, a List of Nodes. Color Red
     * @param  {array} List path string
     * @return {void}
     */
    function highlightPathPrimary(listNode) {
        var path = listHighlightPath(listNode);
        for (var i = 0; i < path.count - 1; i++) {
            var f = path.elt(i);
            var t = path.elt(i + 1);
            highlightLinkPaths(f, t);
            highlightLinkPaths(t, f);
        }
    }

    /**
     * Change Highlight Link Path color
     * @param  {node} start        Node start
     * @param  {node} destination Node end
     * @return {void}
     */
    function highlightLinkPaths(start, destination) {
        myDiagram.startTransaction("changed color");
        var links = start.findLinksTo(destination);
        while (links.next()) {
            links.value.path.stroke = "red";
        }
        myDiagram.commitTransaction("changed color");
    }


    function convertData() {
        var data = [];
        var length = linkDataArray.length;

        for (var i = 0; i < length; i++) {
            data[i] = [];
            for (var j = 0; j < length; j++) {
                data[i][j] = 0;
            }
        }

        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                var tmp = linkDataArray[j];

                if (i == tmp.from) {
                    if (bidirectional == false) {
                        data[i][parseInt(tmp.to)] = parseInt(tmp.text);
                        data[parseInt(tmp.to)][i] = parseInt(tmp.text);
                    } else {
                        data[i][parseInt(tmp.to)] = parseInt(tmp.text);
                    }
                }
            }
        }

        return data;
    }

    function getNodesName() {
        var results = [];
        for (var i = 0; i < nodeList.length; i++) {
            results[i] = nodeList[i].name;
        }

        return results;
    }

    $('#btnRun').click(function (event) {
        myDiagram.clearHighlighteds();
        var data = convertData();

        if (!isAuto) {
            names = getNodesName();
        }

        var source = $('#source').val();
        var destination = $('#destination').val();

        //Find short path
        var g = new Graph();

        //Convert data GoJS to Dijkstra
        g.convertGraph(names, data);

        var coloringBlue = [];
        g.simulation(source, destination, highlightPath, coloringBlue);

        // var j = 0;
        // for(var i = 0; i < coloringBlue.length; i++)
        // {
        //     setTimeout(function(){
        //         highlightPath(coloringBlue[j]);
        //         j++;
        //     }, i * 1000);
        // }

        var result = g.printStrResult(source, destination);
        console.log("Đường đi ngắn nhất: " + result);

        //Highlight short path on diagram
        setTimeout(function () {
            highlightPathPrimary(g.arrayResult(source, destination).reverse());
        }, index * 1000);

        // Log test, with the addition of reversing the path and prepending the first node so it's more readable
        $("#result").text(result);
    });
});