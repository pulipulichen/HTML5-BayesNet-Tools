var redraw;
var height = 300;
var width = 400;
var public_r = undefined

/* only do all this when document has finished loading (needed for RaphaelJS) */
$(function() {
    var paper = Raphael("raphael-canvas", 300, 300);
    var infobox = new Infobox(paper, {x:10,y:10, width:250, height:250});
    infobox.div.html('<p>This is some crazy content that goes inside of that box that will wrap around.</p>');
    $(window).resize();
});
