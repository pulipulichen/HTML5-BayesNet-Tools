var DEBUG = {
    enable_bayes: true
};

var _draw_result_table = function (_xml_text) {
    var _container = $("#preview_html");
    
    
    if ($("#preview_html_wrapper").hasClass("wrapper")) {
        _container.css({
            "width": "auto",
            "height": "auto"
        });
        $("#preview_html_wrapper").removeClass("wrapper");
        setTimeout(function () {
            _draw_result_table(_xml_text);
        }, 0);
        return;
    }
    
    
    
    var _xml = $($.parseXML(_xml_text));
    //console.log(_xml.find('VARIABLE[TYPE="nature"]').length);
    
    
    // ----------------------------------------
    var _given = {};
    var _lines_cpt = {};
    
    var _bayes_nodes = {};
    _parse_xml_definition(_xml, _given, _lines_cpt);
    
    //console.log(_cpt);
    
    // ------------------------------------
    
    var _outcome_click_handler = function () {
        var _d_li = $(this);
        _outcome_set_handler(_d_li, _bayes_nodes);
        _display_bayesnet_prob_dis();
    };
    
    var _outcome = {};
    var _open_cpt_window = function () {
        var _name = $(this).parents('[node_id]:first').attr("node_id");
        var _c = _lines_cpt[_name];
        var _g = _given[_name];
        var _o = _outcome[_name];
        var _r = _cpt_rows[_name];
        _draw_cpt_window(_name, _c, _g, _o, _r);
    };
    
    var _variables = [];
    _parse_xml_vairable(_xml, _variables, _outcome);
    _resize_container(_variables.length);
    
    // -----------------------
    
    _draw_node_div(_variables
        , _open_cpt_window
        , _given
        , _outcome
        , _outcome_click_handler);
    _draw_node_list(_variables
        , _open_cpt_window
        , _given
        , _outcome
        , _outcome_click_handler);
        
    // --------------------------
    // 重整cpt表格
    var _object_cpt = {};
    var _cpt_rows = {};
    if (DEBUG.enable_bayes === true) {
        var _reorganize_cpt = function (_config, _pi) {
            //var _parents = _given[_name];
            if (_config.p.length === 0) {
                return _config.c[0];
            }
            else if (_pi === _config.p.length) {
                var _c = _config.c[_config.l];
                _config.l++;
                //console.log(_config.pg);
                //console.log(_c);
                _cpt_rows[_config.n].push({
                    parents_outcome: JSON.parse(JSON.stringify(_config.pg)),
                    prob: _c
                });
                return _c;
            }
            else {
                var _c = [];
                var _parent_name = _config.p[_pi];
                var _parent_outcome = _outcome[_parent_name];
                //console.log(_pi);
                //_config.pi++;
                for (var _p = 0; _p < _parent_outcome.length; _p++) {
                    _config.pg[_parent_name] = _parent_outcome[_p];
                    _c.push(_reorganize_cpt(_config, (_pi+1) ));
                    //var _parent_outcome_list = _outcome[_parent_name];
                }
                while (_c.length === 1) {
                    _c = _c[0];
                }
                return _c;
            }
        };
        
        for (var _name in _lines_cpt) {
            var _config = {
                n: _name,
                c: _lines_cpt[_name],
                l: 0,
                p: _given[_name],
                pg: {}
            };
            _cpt_rows[_name] = [];
            //console.log(_config);
            _object_cpt[_name] = _reorganize_cpt(_config, 0);
        }
       /*
        var _reorganize_cpt = function (_c, _parents_list, _p_index) {
            var _parent_name = _parents_list[_p_index];
            
        };
       
        for (var _name in _cpt) {
            if (_cpt[_name].length === 1) {
                _cpt[_name] = _cpt[_name][0];
            }
            else {
                var _parents_list = _given[_name];
                //var _new_parents_list = [];
                _cpt[_name] = _reorganize_cpt(_cpt[_name], _parents_list, 0);
            }
        }
        */
        //console.log(_cpt);
        //console.log(_cpt_rows);
    }
    
    // -----------------------
    // 設定貝氏網路\
    if (DEBUG.enable_bayes === true) {
        for (var _v = 0; _v < _variables.length; _v++) {
            var _name = _variables[_v];
            var _bn  = new Bayes.Node(_name,_outcome[_name]);
            _bn.cpt = _object_cpt[_name];
            _bayes_nodes[_name] = _bn;
            //Bayes.nodes.push(_bn);
        }
    }
    
    
    // 設定parent
    if (DEBUG.enable_bayes === true) {
        for (var _name in _given) {
            var _parents = _given[_name];
            for (var _i = 0; _i < _parents.length; _i++) {
                var _parent_name = _parents[_i];
                _bayes_nodes[_name].parents.push(_bayes_nodes[_parent_name]);
            }
        }
        
        for (var _name in _bayes_nodes) {
            Bayes.nodes.push(_bayes_nodes[_name]);
        }
    }
    
    var _display_bayesnet_prob_dis = function () {
        if (DEBUG.enable_bayes === true) {
            Bayes.sample(10000);
        }
        for (var _name in _bayes_nodes) {
            var _probs = _display_prob_dis(_bayes_nodes[_name].sampledLw);
            for (var _i = 0; _i < _probs.length; _i++) {
                var _p = _probs[_i];
                _container.find('div[node_id="' + _name + '"] li[value_index="' + _i + '"] .prob').text(_p);
                $('.bayesnet-table tr[node_id="' + _name + '"] li[value_index="' + _i + '"] .prob').text(_p);
            }
        }
    };
    
    // ----------------------------------
    
    div_graph("#preview_html");
    _display_bayesnet_prob_dis();
    
    //setTimeout(function () {
    $("#preview_html_wrapper").addClass("wrapper");
    //}, 0);
    //$("body").dragScroller();
    //console.log(Bayes);
};

var _display_prob_dis = function (_ary) {
    //console.log(_ary);
    var _sum = _ary.reduce(function(a, b) { return a + b; }, 0);
    var _ary2 = [];
    for (var _i = 0; _i < _ary.length; _i++ ) {
        var _p = _ary[_i] / _sum;
        _p = Math.round(_p * 10000) / 100;
        if (isNaN(_p)) {
            console.log("NaN");
        }
        _ary2.push(_p);
    }
    return _ary2;
};

var _draw_cpt_window = function (_name, _c, _name_given, _name_outcome, _name_cpt_row) {
    var _win = window.open("", _name + "_cpt"
        , "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes");

    var _title = '「' + _name + '」條件機率表(CPT)';

    if ($(_win.document.body).find("div:first").length > 0) {
        return;
    }

    $(_win.document.head).append('<title>' + _title + '</title>');
    $(_win.document.head).append('<link rel="stylesheet" href="style.css" />');

    var _container = $('<div class="cpt-container" style="display:inline-block;text-align:center;margin:auto;"></div>').appendTo($(_win.document.body));
    $('<h1 style="white-space:nowrap;">' + _title +'</h1>').appendTo(_container);
    var _table = $('<table align="center" border="1" cellspacing="0" cellpadding="5">'
        + '<thead><tr class="attr-name"></tr><tr class="domain"></tr></thead>'
        + '<tbody></tbody>'
        + '</table>').appendTo(_container);
    //_win.document.body.innerHTML = "HTML";

    // -------------------------------

    var _thead_attr = _table.find("thead > tr.attr-name");
    if (_name_given.length > 0) {
        for (var _g = 0; _g < _name_given.length; _g++) {
            $('<th align="center" rowspan="2" valign="bottom">' + _name_given[_g] + '</th>').appendTo(_thead_attr);
        }

    }

    // --------------------------------

    $('<th align="center" colspan="' + _name_outcome.length + '">' + _name + '</th>').appendTo(_thead_attr);
    var _thead = _table.find("thead > tr.domain");
    $('<th align="center">' + _name_outcome.join('</th><th align="center">') + '</th>').appendTo(_thead);

    // -------------------------------

    var _tbody = _table.find("tbody");
    for (var _i = 0; _i < _c.length; _i++) {
        var _tr = $('<tr></tr>').appendTo(_tbody);

        // 在之前要先加入parents_outcome
        for (var  _g = 0; _g < _name_given.length; _g++) {
            var _parent_name = _name_given[_g];
            var _parent_outcome = _name_cpt_row[_i]['parents_outcome'][_parent_name];
            $('<th align="left">' + _parent_outcome + '</th>').appendTo(_tr);
        }

        for (var _j = 0; _j < _c[_i].length; _j++) {
            var _p = _c[_i][_j];
            _p = Math.round(_p*10000)/10000;
            $('<td align="left">' + _p + '</td>').appendTo(_tr);
        }
    }

    // -------------------------------

    _table.find('th').css('background-color', '#CCC');

    setTimeout(function () {
        //console.log(_container.width());
        _win.resizeTo(_container.outerWidth() + 50, _container.outerHeight() + 100);
    },0);
};

var _parse_xml_definition = function (_xml, _given, _lines_cpt) {
    _xml.find("DEFINITION").each(function (_i, _ele) {
        _ele = $(_ele);

        var _for = _ele.find("FOR:first").text();
        var _g = [];
        _ele.find("GIVEN").each(function (_j, _ele_given) {
            _g.push($(_ele_given).text());
        });
        _given[_for] = _g;

        var _table = _ele.find("TABLE:first").text();
        var _cpt_table = [];
        var _lines = _table.trim().split("\n");
        for (var _l = 0; _l < _lines.length; _l++) {
            var _field = _lines[_l].trim().split(" ");
            var _cpt_row = [];
            for (var _f = 0; _f < _field.length; _f++) {
                _cpt_row.push(eval(_field[_f]));
            }
            _cpt_table.push(_cpt_row);
        }
        _lines_cpt[_for] = _cpt_table;
    });
};

var _parse_xml_vairable = function (_xml, _variables, _outcome) {
    
    var _variables_ele = _xml.find('VARIABLE[TYPE="nature"]');
    
    _variables_ele.each(function (_i, _ele) {
        _ele = $(_ele);
        var _name = _ele.find('NAME:first');
        if (_name.length === 0) {
            _name = _ele.find('name:first');
        }
        _name = _name.text();
        _variables.push(_name);
        
        // -------------------------
        var _o = [];
        _ele.find("OUTCOME").each(function (_j, _ele_given) {
            var _text = $(_ele_given).text();
            _text = _text.split("'\\'").join('');
            _text = _text.split("\\''").join('');
            _o.push(_text);
        });
        _outcome[_name] = _o;
    });
};

var _resize_container = function (_var_length) {
    var _square = Math.ceil(Math.sqrt(_var_length));
    var _container = $("#preview_html");
    var _node_width_unit = 200;
    if (_square > 2) {
        //_node_width_unit = 300;
    }
    _container.css({
        //"border": "1px solid red",
        "width": (_node_width_unit * _square) + "px",
        "height": (_node_width_unit * _square) + "px",
        "border-width": 0
    });
    
    if (_container.outerWidth() < (_node_width_unit * _square)) {
        //_container.css("width", (_node_width_unit * _square) + "px");
    }
};

var _draw_node_div = function (_variables, _open_cpt_window, _given, _outcome, _outcome_click_handler) {
    var _container = $("#preview_html");
    for (var _v = 0; _v < _variables.length; _v++) {
        var _name = _variables[_v];
        
        // --------------------------------------------
        var _div = $('<div node_id="' + _name + '">'
            + '<button type="button" class="ui icon teal mini button" title="點擊檢視條件機率表(CPT)"><i class="table icon"></i></button>'
            + '<span class="attr-name">' + _name + '</span><span class="setted-evidence"></span>'
            + '</div>');
        _div.appendTo(_container);
        
        _div.find("button:first").click(_open_cpt_window);
        
        if (_given[_name].length > 0) {
            _div.attr("parent_nodes", JSON.stringify(_given[_name]));
        }
        
        //_div.css("background-color", 'yellow');
        
        var _domain_ul = $('<ul></ul>').appendTo(_div);
        for (var _o = 0; _o < _outcome[_name].length; _o++) {
            var _d = _outcome[_name][_o];
            var _d_li = $('<li outcome="' + _d + '">'
                + '<label>'
                    + '<input type="checkbox" /> ' + _d + ': <span class="prob">100.00</span>%'
                + '</label></li>')
                    .appendTo(_domain_ul);
            _d_li.attr("value_index", _o).click(_outcome_click_handler);
            //_d_li
        }
        //_domain_ul.find("li");
    };
};

var _draw_node_list = function (_variables, _open_cpt_window, _given, _outcome, _outcome_click_handler) {
    var _container = $(".bayesnet-table > table > tbody").empty();
    for (var _v = 0; _v < _variables.length; _v++) {
        var _name = _variables[_v];
        var _tr = $('<tr node_id="' + _name + '"></tr>').appendTo(_container);
        
        if (_given[_name].length > 0) {
            _tr.attr("parent_nodes", JSON.stringify(_given[_name]));
        }
        
        // --------------------------------------------
        var _div = $('<td>'
            
            + '<div class="attr-name">' + _name + '</div><span class="setted-evidence"></span>'
            + '</td>');
        _div.attr('id', 'node_list_' + escape(_name) );
        _div.appendTo(_tr);
        
        // ------------------------------
        var _cpt = $('<td>'
                + '<button type="button" class="ui icon teal mini button" title="點擊檢視條件機率表(CPT)"><i class="table icon"></i></button>'
                + '</td>').appendTo(_tr);
        
        _cpt.find("button:first").click(_open_cpt_window);
        
        // --------------
        
        var _domain_td = $('<td><ul></ul></td>').appendTo(_tr);
        var _domain_ul = _domain_td.find("ul");
        for (var _o = 0; _o < _outcome[_name].length; _o++) {
            var _d = _outcome[_name][_o];
            var _d_li = $('<li outcome="' + _d + '">'
                + '<label>'
                    + '<input type="checkbox" /> ' + _d + ': <span class="prob">100.00</span>%'
                + '</label></li>')
                    .appendTo(_domain_ul);
            _d_li.attr("value_index", _o).click(_outcome_click_handler);
            //_d_li
        }
        
        // -------------------------
        
        $('<td><i class="long arrow left icon"></i></td>').appendTo(_tr);
        
        // -------------------------
        
        var _parent_td = $('<td class="parent-ndoes"></td>').appendTo(_tr);
        for (var _g = 0; _g < _given[_name].length; _g++) {
            var _parent_name = _given[_name][_g];
            var _button = $('<a href="#node_list_' + escape(_parent_name) + '">'
                + '<button type="button" class="ui button teal tiny">' + _parent_name + '</button>'
                + '</a>')
                    .appendTo(_parent_td);
        }
    };
};


var _outcome_set_handler = function (_d_li, _bayes_nodes) {
    
    // 先確定他的名稱啦
    var _div = _d_li.parents("[node_id]:first");
    var _name = _div.attr("node_id");
    var _value_index = parseInt(_d_li.attr("value_index"), 10);
    var _outcome = _d_li.attr("outcome");
    var _checked = _d_li.find("input").prop("checked");
    
    // -----------------------------
    // 把所有人的click都移除掉
    var _container = $("#preview_html");
    var _table = $(".bayesnet-table > table > tbody");
    
    _container.find('[node_id="' + _name + '"] ul li input:checked').prop("checked", false);
    _table.find('[node_id="' + _name + '"] ul li input:checked').prop("checked", false);
    
    _container.find('[node_id="' + _name + '"].set').removeClass("set");
    _table.find('[node_id="' + _name + '"].set').removeClass("set");
    
    _container.find('[node_id="' + _name + '"] .set').removeClass("set");
    _table.find('[node_id="' + _name + '"] .set').removeClass("set");
    
    // -----------------------------
    // 根據情況決定要不要勾選
    
    if (_checked === true) {
        _container.find('[node_id="' + _name + '"] ul li[value_index="' + _value_index + '"] input').prop("checked", true);
        _table.find('[node_id="' + _name + '"] ul li[value_index="' + _value_index + '"] input').prop("checked", true);
        
        _container.find('[node_id="' + _name + '"] ul li[value_index="' + _value_index + '"]').addClass("set");
        _table.find('[node_id="' + _name + '"] ul li[value_index="' + _value_index + '"]').addClass("set");
        
        _container.find('[node_id="' + _name + '"] .setted-evidence').text("= " + _outcome);
        _table.find('[node_id="' + _name + '"] .setted-evidence').text("= " + _outcome);
        
        _container.find('[node_id="' + _name + '"]').addClass("set");
        _table.find('[node_id="' + _name + '"]').addClass("set");
        
        _bayes_nodes[_name].value = _value_index;
        _bayes_nodes[_name].isObserved = true;
    }
    else {
        _container.find('[node_id="' + _name + '"] .setted-evidence').empty();
        _table.find('[node_id="' + _name + '"] .setted-evidence').empty();
        
        _bayes_nodes[_name].isObserved = false;
    }
    
    /*
    _d_li.addClass("current");
    var _ul = _d_li.parent();
    var _setted_evi = _div.find(".setted-evidence");
    
    // 先把其他人的checked都移除掉
    _ul.find('li:not(.current) :checked').prop('checked', false);
    _ul.find(".set").removeClass("set");
    //_d_li.find("input").attr("checked", "checked");
    _d_li.removeClass("current");

    // ------------------------------------------
    //console.trace(_name);
    if (_d_li.find("input").prop("checked") === true) {
        _d_li.addClass("set");
        _bayes_nodes[_name].value = _value_index;
        _bayes_nodes[_name].isObserved = true;
        _setted_evi.text("=" + _d_li.attr("outcome"));
        _div.addClass("set");
    }
    else {
        _bayes_nodes[_name].isObserved = false;
        _setted_evi.empty();
        _div.removeClass("set");
    }
    */
};

// ---------------------------------
$(function () {
    $(".cancel-evidences-button").click(_cancel_evidences);
});

var _cancel_evidences = function () {
    $(".bayesnet-table li label input:checked").click();
};