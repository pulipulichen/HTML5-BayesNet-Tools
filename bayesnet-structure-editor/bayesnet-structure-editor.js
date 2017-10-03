var _attr_list;
var _draw_bayesnet_table = function (_csv) {
    
    //console.log([_csv.indexOf('<?xml version="1.0"?>'), _csv.indexOf('<VARIABLE TYPE="nature">') ]);
    if (_csv.indexOf("@data") > 0 && _csv.indexOf("@attribute ") > 0) {
        _attr_list = _get_attr_list_from_arff(_csv);
    } 
    else if (_csv.indexOf('<?xml version="1.0"?>') > -1 && _csv.indexOf('<VARIABLE TYPE="nature">') > 0) {
        _attr_list = _get_attr_list_from_xmlbif(_csv);
    }
    else {
        // 只需要第一行
        var _first_line = _csv.trim().split("\n")[0].trim();
        if (_first_line.indexOf(",") === -1) {
            alert("輸入格式錯誤：沒有變項資料。");
            return;
        }
        _attr_list = _first_line.trim().split(",");
    }
    
    _reset_bayesnet_table();
    //console.log(_attr_list);
    
    // ------------------
    _setup_bayesnet_table(_attr_list);
    
    // ------------------
    _setup_quick_structure(_attr_list);
};

var _get_attr_list_from_arff = function (_arff) {
    var _parts = _arff.split("@attribute ");
    var _result = [];
    for (var _i = 1; _i < _parts.length; _i++) {
        var _r = _parts[_i].trim();
        _r = _r.substr(0, _r.indexOf(" "));
        _result.push(_r);
    }
    return _result;
};

var _get_attr_list_from_xmlbif = function (_xml_text) {
    var _xml = $($.parseXML(_xml_text));
    var _result = [];
    _xml.find("VARIABLE > NAME").each(function (_i, _name) {
        _result.push($(_name).text().trim());
    });
    return _result;
};

// --------------------------------

var _reset_bayesnet_table = function () {
    var _table = $("#bayesnet_structure_editor > table");
    _table.find("tbody tr").remove();
    
    $("#input_target_node option").remove();
};

// --------------------------------

var _setup_bayesnet_table = function (_attr_list) {
    var _tr_template = $('<tr>'
        + '<th class="child-node bottom-border-thin" align="right">'
            + '<button type="button" class="ui button tiny"></button>'
        + '</th>'
        + '<th align="center">'
            + '<i class="long arrow left icon"></i>'
        + '</th>'
        + '<td class="cell_td">'
            + '<div class="ui inline field">'
                + '<span class="parent-nodes"></span>'
                + '<span class=" inline field add-container"><select name="input_target_node" ></select>'
                + '<button type="button" class="ui button teal tiny add-parent-nodes">'
                    + '<i class="add square icon"></i>'
                    + '新增'
                + '</button></span>'
                + '</div>'
        + '</td></tr>');
    
    var _tbody = $("#bayesnet_structure_editor table tbody");
    for (var _i = 0; _i < _attr_list.length; _i++) {
        var _tr = _tr_template.clone().appendTo(_tbody);
        var _a = _attr_list[_i];
        _tr.attr("child_node", _a);
        
        // ----------------------
        
        _tr.find(".child-node button").text(_a);
        
        // ----------------------
        
        var _select = _tr.find('select[name="input_target_node"]');
        for (var _j = 0; _j < _attr_list.length; _j++) {
            if (_i === _j) {
                continue;
            }
            var _b = _attr_list[_j];
            _select.append('<option value="' + _b + '">' + _b + '</option>');
        }
        _select.find("option:last").attr("selected", "selected");
        
        // ----------------------
        
        _tr.find(".add-parent-nodes").click(_add_parent_nodes);
    }
};

// --------------------------------

var _setup_quick_structure = function (_attr_list) {
    var _select = $("#input_target_node");
    
    var _has_class = false;
    for (var _i = 0; _i < _attr_list.length; _i++) {
        var _a = _attr_list[_i];
        if (_a !== 'class') {
            _select.append('<option value="' + _a + '">' + _a + '</option>');
        }
        else {
            _has_class = true;
            _select.append('<option value="' + _a + '" selected="selected">' + _a + '</option>');
        }
    }
    
    if (_has_class === false) {
        _select.find("option:last").attr("selected","selected");
    }
    
    
    $(".input-set-target-child").click();
};

// --------------------------------

var _add_parent_nodes = function () {
    var _button = $(this);
    var _select = _button.prevAll("select:first");
    var _add_attr = _select.val().trim();
    var _option = _select.find('option[value="'+_add_attr+'"]');
    _option.remove();
    
    if (_select.find("option").length > 0) {
        _select.find('option:last').attr("selected", "selected");
    }
    else {
        _select.parent().hide();
    }
    
    // -------------
    
    var _parent_node = _create_parent_node(_add_attr);
    _parent_node.appendTo(_button.parent().prevAll(".parent-nodes:first"));
};

var _create_parent_node = function(_add_attr) {
    var _node = $('<button type="button" class="ui button teal tiny">'
        + _add_attr
        + '<i class="remove icon"></i>'
        + '</button>').click(_remove_parent_node);
    return _node;
};

var _remove_parent_node = function () {
    var _node = $(this);
    var _attr = _node.text().trim();
    //console.log(_attr);
    
    var _option = $('<option value="' + _attr + '">' + _attr + '</option>');
    var _add_container = _node.parent().nextAll('.add-container:first');
    var _select = _add_container.find("select");
    _select.prepend(_option);
    _select.find('option[value="'+_attr+'"]').attr("selected", "selected");
    _select.val(_attr);
    _add_container.show();
    
    _node.remove();
};

// -------------------------------

$(function () {
    $(".input-set-target-parent").click(function () {
        _quick_set_parent_node(true);
    });
    $(".input-set-target-child").click(function () {
        _quick_set_parent_node(false);
    });
});

var _quick_set_parent_node = function (_is_parent) {
    var _attr = $("#input_target_node").val();
    
    $("#bayesnet_structure_editor tbody tr .parent-nodes button").click();
    
    if (_is_parent === true) {
        $("#bayesnet_structure_editor tbody tr").each(function (_i, _tr) {
            _tr = $(_tr);
            var _child_node = _tr.find('.child-node button').text().trim();
            if (_child_node === _attr) {
                return;
            }
            
            var _select = _tr.find('select[name="input_target_node"]');
            _select.find('option[value="'+_attr+'"]').attr("selected", "selected");
            _select.val(_attr);
            _tr.find('.add-parent-nodes').click();
        });
    }
    else {
        //return;
        var _tr = $('#bayesnet_structure_editor tbody tr[child_node="' + _attr + '"]');
        var _select = _tr.find('select[name="input_target_node"]');
        var _button = _tr.find('.add-parent-nodes');
        
        while (_select.filter(":visible").length > 0 
                && _select.find("option").length > 0) {
            _button.click();
        }
    }
};

// --------------------------------------------

$(function () {
    $(".input-set-reverse").click(_set_reverse);
});

var _set_reverse = function () {
    // 先蒐集既有的資料
    var _config = _get_bayesnet_from_ui();
    
    // 清除所有的父節點
    _reset_nodes_parent();
    
    var _tbody = $("#bayesnet_structure_editor > table tbody");
    for (var _child in _config) {
        var _parents_list = _config[_child];
        for (var _c = 0; _c < _parents_list.length; _c++) {
            var _parent = _parents_list[_c];
            var _tr = _tbody.find('tr[child_node="' + _parent + '"]');
            _tr.find("select").val(_child);
            _tr.find(".add-parent-nodes").click();
        }
    }
};

var _get_bayesnet_from_ui = function () {
    var _tr_list = $("#bayesnet_structure_editor > table tbody > tr");
    
    var _config = {};
    _tr_list.each(function (_i, _tr) {
        _tr = $(_tr);
        var _attr = _tr.find(".child-node button").text().trim();
        var _parents = [];
        _tr.find(".parent-nodes button").each(function (_j, _button) {
            var _p = $(_button).text().trim();
            _parents.push(_p);
        });
        _config[_attr] = _parents;
    });
    
    return _config;
};

var _reset_nodes_parent = function () {
    $("#bayesnet_structure_editor > table tbody > tr .parent-nodes button").click();
};



// --------------------------------------------

$(function () {
    $(".input-download-bayes-net-xml").click(_download_bayes_net_xml_file);
});


var _download_bayes_net_xml_file = function () {
    
    var _name = _file_name;
    if (_name === undefined) {
        _name = "xmlbif-" + _create_current_date_string() + ".xml";
    }
    else {
        _name = _name.substr(0, _name.indexOf("."));
        _name = "xmlbif-" + _name + '.xml';
    }
    
    var _tr_list = $("#bayesnet_structure_editor > table tbody > tr");
    
    var _var_list = [];
    
    _tr_list.each(function (_i, _tr) {
        _tr = $(_tr);
        _var_list.push(_tr.find('th.child-node button').text());
    });
    
    // ---------------------------------
    // 根據var數量，來決定九宮格位置
    var _square_width = Math.ceil(Math.sqrt(_var_list.length));
    
    // ---------------------------------
    
    var _variables = "";
    var _var_head = '<VARIABLE TYPE="nature"><NAME>';
    
    var _definition = "";
    
    _tr_list.each(function (_i, _tr) {
        _tr = $(_tr);
        
        var _x = (_i % _square_width);
        var _x_pos = 10 + (_x * 200);
        var _y = (_i - _x) / _square_width;
        var _y_pos = 10 + (_y * 100);
        
        var _v = _var_head 
                + _var_list[_i] 
                + '</NAME>'
                + '<PROPERTY>position = (' + _x_pos + ', ' + _y_pos + ')</PROPERTY>'
                + '</VARIABLE>';
        _variables += _v;
        
        var _d = '<DEFINITION><FOR>' + _var_list[_i] + '</FOR>';
        _tr.find('.parent-nodes button').each(function (_j, _button) {
            var _parent_node = $(_button).text().trim();
            _d += '<GIVEN>' + _parent_node + '</GIVEN>';
        });
        _d += '<TABLE></TABLE></DEFINITION>';
        _definition += _d;
    });
    
    $.get("bayes-net-template.txt", function (_xml) {
        _xml = _xml.replace("{{NAME}}", _name);
        _xml = _xml.replace("{{VARIABLE}}", _variables);
        _xml = _xml.replace("{{DEFINITION}}", _definition);
        
        //console.log(_xml);
        _download_file(_xml, _name, "text/xml");
    });
};
