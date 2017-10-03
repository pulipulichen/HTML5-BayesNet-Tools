var div_graph = function (_selector) {
    var _container = $(_selector);
    //_container.addClass("div_graph-hide-position");
    
    var _div_list = _container.find("div");
    _div_list.addClass("div_graph-node");
    
    var _container_width = _container.outerWidth();
    var _container_height = _container.outerHeight();
    
    var _g = new Graph();
    
    var _id = _container.attr("id");
    if (_id === undefined) {
        _id = 'div_graph' + (new Date()).toISOString().slice(0,10).replace(/-/g,"");
        _container.attr('id', _id);
    }
    
    
    // ------------------------------
    
    var _div_graph_render = function (r, _n) {
        var _node_id = _n.label;
        var _node = _container.find('[node_id="' + _node_id + '"]');
        var _c = $('<div></div>').addClass("div_graph-node-wrapper").append(_node).appendTo(_container);
        var _w = _c.outerWidth();
        var _h = _c.outerHeight();
        var _x = _n.point[0];
        var _y = _n.point[1];
        
        //_N = _n;
        //console.log($(_n));
        /*
        console.log(JSON.stringify({
            h: _h,
            w: _w,
            x: _x,
            y: _y
        }));
        */
        
        var _stroke_width = 1;
        var _m = 10;
        var _rect_y = (_y - (_h / 2));
        var _rect_height = (_h + (_stroke_width));
        if (_rect_y < _m) {
            _rect_y = _m;
        }
        else if (_rect_y + _rect_height > (_container_height - _m)) {
            // 過長的時候，修正位置
            console.log(["修正y", _rect_y, (_container_height - _m - _rect_height)]);
            //_rect_y = _rect_y * 0.5;
            //while (_rect_y + _rect_height > (_container_height - _m)) {
            //    _rect_y = _rect_y * 0.75;
            //}
            _rect_y = _container_height - _m - _rect_height;
        }
        
        var _rect_x = (_x - (_w / 2));
        var _rect_width = (_w + (_stroke_width));
        if (_rect_x < _m) {
            _rect_x = _m;
        }
        else if (_rect_x + _rect_width > (_container_width - _m)) {
            _rect_x = _container_width - _m - _rect_width;
        }
        
        
        var _rect = r.rect(_rect_x, _rect_y, _rect_width, _rect_height)
                .attr({"fill": "#FFF", "stroke-width": _stroke_width});
        //console.log([_h / 2, _stroke_width]);
        //var _margin = 9;
        _c.addClass('appned-to-svg');
        
        var _set_offset = function () {
            //var _offset = $(_rect.node).offset();
            //RECT = $(_rect.node);
            //var _top = _offset.top;
            //var _left = _offset.left;
            var _node = $(_rect.node);
            
            _NODE = _node;
            var _node_top = eval(_node.attr("y"));
            var _node_left = eval(_node.attr("x"));
            /*
            var _node_width = eval(_node.attr("width"));
            var _node_height = eval(_node.attr("height"));
            var _node_center_top = _node_top + (_node_height / 2);
            var _node_center_left = _node_left + (_node_width / 2);
            //var _c_center_top = (_node_center_top - (_c.outerWidth() / 2));
            */
           //console.log([_node_top, _node_left]);
            var _c_center_top = _node_top + (_stroke_width/2);
            //var _c_center_left = (_node_center_left + (_c.outerHeight() / 2));
            var _c_center_left = _node_left + (_stroke_width/2);
            
            _c.css({
                "top": _c_center_top + "px",
                "left": _c_center_left + "px"
            });
            /*
            console.log(JSON.stringify({
                "_node_top": _node_top,
                "_node_left": _node_left,
                "_node_width": _node_width,
                "_node_height": _node_height,
                "_node_center_top": _node_center_top,
                "_node_center_left": _node_center_left,
                "_c_center_top": _c_center_top,
                "_c_center_left": _c_center_left
            }));
            */
            //console.log([_top, _left]);
        };
        _set_offset();
            
        //console.log(["c", (_offset.top + (_stroke_width / 2)), (_offset.left + (_stroke_width / 2))]);
        var start = function () {
            DRAG_SCROLL_ENABLE = false;
            _c.addClass("moving");
            $("body").one("mouseup", up);
        };
        var up = function (e) {
            _set_offset();
            _c.removeClass("moving");
            DRAG_SCROLL_ENABLE = true;
        };
        var set = r.set().push(_rect);
        set.mousedown(start);
        //set.mouseup(up);
        
        return set;
    };
    
    // -------------------------------
    // 畫點
    _div_list.each(function (_i, _div) {
        _div = $(_div);
        var _node_id = _div.attr("node_id");
        if (_node_id === undefined) {
            _node_id = _id + "_" + _i;
            _div.attr("node_id", _node_id);
        }
        _g.addNode(_node_id, {
            label: _node_id,
            render: _div_graph_render
        });
        //console.log(_node_id);
    });
    
    // -------------------------------
    // 劃線
    _div_list.each(function (_i, _div) {
        _div = $(_div);
        var _node_id = _div.attr("node_id");
        var _parent_nodes = _div.attr("parent_nodes");
        if (_parent_nodes !== undefined) {
            _parent_nodes = JSON.parse(_parent_nodes);
            if (Object.prototype.toString.call( _parent_nodes ) === '[object Array]') {
                for (var _p = 0; _p < _parent_nodes.length; _p++ ) {
                    _g.addEdge(_parent_nodes[_p], _node_id, { directed : true });
                    //console.log([_node_id, _parent_nodes[_p]]);
                }
            }
            //console.log(_parent_nodes);
        }
    });
    //_g.addEdge("A", "B", { directed : true });
    
    // -------------------------------
    
    //container.show();
    var _layouter = new Graph.Layout.Spring(_g);
    _layouter.layout();
    console.log("排版之後");
    for (var _i = 0; _i < _g.nodelist.length; _i++) {
        var _n = _g.nodelist[_i];
        console.log([_n.layoutPosX, _n.layoutPosY]);
    }
    console.log(_g);
    /*
    console.log(_g);
    //return;
    var _layoutX = [-0.01, -1, 1, 0.01];   //3.2/3 = 0.8
    var _layoutY = [-1.5, -0.5, -0.5, 1.5];   //3.2/3 = 0.8
    
    console.log("處理過後");
    for (var _i = 0; _i < _g.nodelist.length; _i++) {
        var _n = _g.nodelist[_i];
        //_n.layoutForceX = 0;
        //_n.layoutForceY = 0;
        //console.log([_n.layoutPosX, _n.layoutPosY]);
        
        // -1.5 -0.5 -0.5 -1.5
        // 0-2 / 2; 1-2 / 2 3 -4
        //_n.layoutPosX = 0;
        _n.layoutPosX = _layoutX[_i]*4;   
        _n.layoutPosY = _layoutY[_i]*4;   
        //_n.layoutPosX = _n.layoutPosX *-1;
        //_n.layoutPosY = _n.layoutPosY *-1;
    }
    //_g.layoutMaxX = 1.5;
    //_g.layoutMaxY = 1.5;
    //_g.layoutMinX = -1.5;
    //_g.layoutMinY = -1.5;
    
    console.log(_g);
    //return;
    */
    
    /* draw the graph using the RaphaelJS draw implementation */
    
    //var _renderer = new Graph.Renderer.Raphael(_id, _g, _container_width, _container_height);
    var _renderer = new Graph.Renderer.Raphael(_id, _g, _container_height, _container_width);
    _renderer.draw();
    var _svg = _container.find('svg:first');
    _svg.addClass("div_graph-svg")
            .attr('width', _container_width)
            .attr('height', _container_height)
            .find("rect").addClass("div_graph-rect");
    _renderer.width = _container_width;
    _renderer.height =  _container_height;
    
    /*
    setTimeout(function () {
        //_container.removeClass("div_graph-hide-position");
        //_layouter.layout();
        //_renderer.draw();
        //_container.hide();
        //_container.fadeIn();
    }, 100);
    */
};
