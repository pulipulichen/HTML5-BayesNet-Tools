var redraw;
var height = 200;
var width = 600;
var public_r = undefined

Raphael.el.trigger = function(eventName){
    for(var i = 0, len = this.events.length; i < len; i++) {
        if (this.events[i].name == eventName) {
            this.events[i].f.call(this);
        }
    }
}

/* only do all this when document has finished loading (needed for RaphaelJS) */
window.onload = function() {
    /*
    var paper = Raphael("raphael-canvas", 300, 300);
    var infobox = new Infobox(paper, {x:10,y:10, width:250, height:250});
    infobox.div.html('<p>This is some crazy content that goes inside of that box that will wrap around.</p>');
    
    */
            
        
    g = new Graph();
/* add a node with a customized shape 
       (the Raphael graph drawing implementation can draw this shape, please 
       consult the RaphaelJS reference for details http://raphaeljs.com/) */
    var render = function(r, n) {
            public_r = r;
            /* the Raphael set is obligatory, containing all you want to display */
            /* custom objects go here */
            var _c = $("#raphael-canvas").clone().appendTo("body");
            var _w = _c.width();
            var _h = _c.height();
            var _x = n.point[0];
            var _y = n.point[1];
            console.log(JSON.stringify({
                h: _h,
                w: _w,
                x: _x,
                y: _y
            }));
            var _stroke_width = 1;
            var _m = 0;
            var _rect = r.rect((_y-(_m/2) ), (_x - (_m/2) ), (_w+(_stroke_width)+(_m/2)), (_h+(_stroke_width) + (_m/2)) )
                    .attr({"fill": "#FFF", "stroke-width": _stroke_width});
            //_rect.id = "rect";
            //var _margin = _h/2 - (_stroke_width / 2);
            console.log([_h/2, _stroke_width]);
            var _margin = 9;
            _c.css({
                "position": "absolute",
                //"top": (_x+_margin) + "px",
                //"left": (_y + _margin) + "px"
            });
            
            //_rect.click(function (e) {
                var _offset = $(_rect.node).offset();
                _c.css({
                   "top": (_offset.top + (_stroke_width/2)) + "px",
                   "left": (_offset.left + (_stroke_width/2)) + "px"
               });
            //});
            //setTimeout(function () {
            //    _rect.click();
            //}, 10);
            //_rect.trigger("click");
            var start = function () {
                //_c.fadeOut();
                _c.addClass("moving");
                // storing original coordinates
                /*
                this.ox = this.attr("x");
                this.oy = this.attr("y");
                this.attr({opacity: 1});
                if (this.attr("y") < 60 &&  this.attr("x") < 60)
                    this.attr({fill: "#000"});      
                */
            };
            var move = function (dx, dy) {
                //console.log("move")
                //console.log([dx, dy]);
                // move will be called with dx and dy
                /*
                if (this.attr("y") > 60 || this.attr("x") > 60)
                    this.attr({x: this.ox + dx, y: this.oy + dy}); 
                else {
                    nowX = Math.min(60, this.ox + dx);
                    nowY = Math.min(60, this.oy + dy);
                    nowX = Math.max(0, nowX);
                    nowY = Math.max(0, nowY);            
                    this.attr({x: nowX, y: nowY });
                    if (this.attr("fill") != "#000") this.attr({fill: "#000"}); 
                }
                */
            };
            var up = function (e) {
                //console.log("up");
                //console.log(e);
                var _offset = $(_rect.node).offset();
                //console.log($(e.target).offset())
                //console.log(n.point);
                console.log(_offset);
                // restoring state
                /*
                this.attr({opacity: .5});
                if (this.attr("y") < 60 && this.attr("x") < 60)
                    this.attr({fill: "#AEAEAE"});       
                */
               _c.css({
                   "top": (_offset.top + (_stroke_width/2)  ) + "px",
                   "left": (_offset.left + (_stroke_width/2) )  + "px"
               });
               _c.removeClass("moving");
            };
            
            // rstart and rmove are the resize functions;
            
            //var _text = r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px", text: "aaa"});
            // r.text(n.point[0], n.point[1] + 20, n.label).attr({"font-size":"14px"}));
            
            //console.log(_rect);
            var set = r.set().push(_rect)
            set.mouseup(up);
            //set.drag(start, move, up, move);
            
            //set.drag(move, start, up);
            //$(_rect.node).bind("dragstart", function () {
            /*
            set.drag(function (e) {
                console.log(e);
            })
            */
                
            //});
        
                /*
                    //.push(_text)
            _c.bind("dragstart", function (_e) {
                //console.log(_e);
                //$(this).css("z-index", -1);
                //set.translate(10, 10);
                //set.mouseup();
                //console.log(drag)
            });
            _c.bind("dragend", function (_e) {
                //console.log(_e);
                //$(this).css("z-index", 1);
            });
            console.log(_rect.id);
            */
            
            //setTimeout(function () {
                //console.log('rect[y="'+(_x+0.5)+'"][x="'+(_y+0.5)+'"]');
                //console.log($('rect[y="'+(_x+0.5)+'"][x="'+(_y+0.5)+'"]').length);
                //$('rect[y="'+(_x+0.5)+'"][x="'+(_y+0.5)+'"]').append(_c);
            //}, 0);
                
            //$(set).append(_c);
                //.push();
            //var infobox = new Infobox(r, {x:n.point[0]-30,y:n.point[1], width:250, height:250});
            //infobox.div.html('<p>This is some crazy content that goes inside of that box that will wrap around.</p>');
        
            /* custom tooltip attached to the set */
            //set./*tooltip = Raphael.el.tooltip;*/items.forEach(function(el) {
            //    el.tooltip(r.set().push(r.rect(0, 0, 30, 30).attr({"fill": "#fec", "stroke-width": 1, r : "9px"})))});
            
//            set.tooltip(r.set().push(r.rect(0, 0, 30, 30).attr({"fill": "#fec", "stroke-width": 1, r : "9px"})).hide());
            return set;
        };
        
    /* add a simple node */
    /*
    g.addNode("strawberry", {
        label: "strawberry", 
        overlay : "<b>Hello <a href=\"http://wikipedia.org/\">World!</a></b>",
                shapes : [ {
                type: "rect",
                x: 10,
                y: 10,
                width: 25,
                height: 25,
                stroke: "#f00"
            }, {
                type: "text",
                x: 30,
                y: 40,
                text: "Dump"
            }],
        //render : render
    });
    */
   
   g.addNode("strawberry", {
       label: "strawberry",
       render : render
   });
    g.addNode("cherry", {
       label: "strawberry",
       render : render
   });

    /* add a node with a customized label */
    g.addNode("id34", {
       label: "strawberry",
       render : render
   });

    
    g.addNode("id35", {
       label: "strawberry",
       render : render
   });
   g.addNode("apple", {
       label: "strawberry",
       render : render
   });
//    g.addNode("Wheat", {
        /* filling the shape with a color makes it easier to be dragged */
        /* arguments: r = Raphael object, n : node object */
//        shapes : [ {
//                type: "rect",
//                x: 10,
//                y: 10,
//                width: 25,
//                height: 25,
//                stroke: "#f00"
//            }, {
//                type: "text",
//                x: 30,
//                y: 40,
//                text: "Dump"
//            }],
//        overlay : "<b>Hello <a href=\"http://wikipedia.org/\">World!</a></b>"
//    });
    // ------------------------------------------------------

    /* connect nodes with edges */
    g.addEdge("id34", "cherry");
//    g.addEdge("cherry", "apple");

    /* a directed connection, using an arrow */
    g.addEdge("id34", "strawberry", { directed : true } );
    
    /* customize the colors of that edge */
    //g.addEdge("id35", "apple", { stroke : "#bfa" , fill : "#56f", label : "Label" });
    g.addEdge("id35", "apple", { directed : true }, {label : "Labelaaaaa" });
    
    /* add an unknown node implicitly by adding an edge */
    g.addEdge("strawberry", "apple");

    g.addEdge("id34", "id35");
    g.addEdge("id35", "strawberry");
    g.addEdge("id35", "cherry");

    /* layout the graph using the Spring layout implementation */
    layouter = new Graph.Layout.Spring(g);
    layouter.layout();
    
    
    /* draw the graph using the RaphaelJS draw implementation */
    renderer = new Graph.Renderer.Raphael('canvas', g, height, width);
    renderer.draw();
    
    
    // 偵測每一個節點的位置
    var _is_node_outofbound = function () {
        var _nodes = layouter.graph.nodelist;
        var _max_width = 0;
        var _max_height = 0;
        for (var _i = 0; _i < _nodes.length; _i++) {
            var _n = _nodes[_i];
            var _w = 0;
            if (typeof(_n.shape.items[0].attrs) === "object" 
                    && typeof(_n.shape.items[0].attrs.width) === "number") {
                _w = _n.shape.items[0].attrs.width;
            }
            
            var _h = 0;
            if (typeof(_n.shape.items[0].attrs) === "object" 
                    && typeof(_n.shape.items[0].attrs.height) === "number") {
                _h = _n.shape.items[0].attrs.height;
            }
            
            var _bottom = _n.point[0] + _h;
            var _right = _n.point[1] + _w;
            console.log([_n.id, _n.point[0], _h, _bottom, height, _n.point[1], _w, _right, width ]);
            //if (_bottom > height || _right > width) {
                //_n.point[0] = _n.point[0] - 100;
                //_n.point[1] = _n.point[1] - 100;
                //return true;
            //}
            if (_bottom > _max_height) {
                _max_height = _bottom;
            }
            if (_right > _max_width) {
                _max_width = _right;
            }
            /*
            if (_i === 0) {
                _n.point[0] = 0;
            }
            */
        }
        var _padding = 50;
        $("#canvas svg").attr("width", _max_width + _padding).attr("height", _max_height + _padding);
        renderer.width = _max_width + _padding;
        renderer.height = _max_height + _padding;
        return false;
    };
    
    
    redraw = function() {
        layouter.layout();
        renderer.draw();
    };
    
    var _loop = function () {
        if (_is_node_outofbound() === true) {
            setTimeout(function () {
                //redraw();
                //_loop();
            }, 1000);
        }
    };
    _loop();
    
    
    
    
    //$(window).resize(); // infobox要用
    
};
