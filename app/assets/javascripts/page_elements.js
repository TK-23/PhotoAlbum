function MapToolWindow(tag, map_name) {
  $("#"+ map_name).append('<div id="'+ tag +'" class="map_tool selection_window">A</div>')
  $(".selection_window").draggable({ containment: "parent" }).resizable();
  $(".selection_window").addClass("disable_map")
};

function MapLayer() {
  this.geoJSON = { "type" : "FeatureCollection", "features" : [] };
  this.layer = L.mapbox.featureLayer( this.geoJSON );
  this.insert = function( photoGeoJSON ) {
    this.geoJSON.features.push( photoGeoJSON );
    this.output = this.layer.setGeoJSON( this.geoJSON );
  };
}

function MapBox( object ){
  this.attr = object
  this.name = this.attr.name;
  this.background = function() {
    if ( this.attr.photos.length > 0 ) {
      return "url(\"" + this.attr.photos[0].image + "\""
    } else {
      return "gray"
    }
  }
  this.header = $("<div></div").html( this.name ).addClass("myMapBox");
  this.html = function(){
    return $("<li>").append(
            $("<a>").attr("href", "/my_maps/" + this.attr.id ).html(
              $("<div id=\"" + this.name + "\"></div")
                .html( this.name )
                .addClass( "myMapBox" )
                .attr("style","background:" + this.background() + ")" ) ) );
  };
}

function MapBoxGroup( base_element_tag ){
  this.base = base_element_tag;
  this.contents = [];
  this.update = function() {
    var update = $( this.base )
    for(var i = 0; i < this.contents.length; i++ ){
      update.append( this.contents[i].html() );
    }
    //$(this.base).replaceWith( update )
  };
}


function Panel(base_element_tag, header) {
  this.name = header;
  this.main = this;
  this.base = base_element_tag;
  this.header = $( "<div class=\"panel-heading\"></div>" ).html( "<h3 class=\"panel-title\">" + header + "</h3>" );
  this.footer = "";
  this.contents = [];
  this.active_content = 0;
  this.startListeners = function(){};
  this.photo_ids = function(){
      array = [];
      for (var i = 0; i < this.contents.length; i++) {
        array.push( this.contents[i].photo_id );
      };
      return array
  };
  this.defaultFormat = function (){
    html = $( "<ul>" ).addClass(this.name + " photoList");
    for (var i = 0; i < this.contents.length; i++) {
      $( $( "<li>" ).append( this.contents[i].html() ) ).appendTo(html);
    };
    return html;
  };
  this.main_body = this.defaultFormat;
  this.build = function (){
    output = $( this.main.base ).html(" ");
    $( this.main.header ).appendTo( output );
    this.main_body().appendTo( output );
    $( this.main.footer ).appendTo( output );
    this.main.startListeners();
    return output
  };
  this.clear_photos = function() {
    this.contents = [];
    return this.main.update(this.main);

  };
  this.clear_footer = function() {
    this.main.footer = "";
    return this.main.update( this.main );
  };
};


function CollectionPhoto( photo_id, photo_url, header ) {
  this.header = header
  this.photo_id = photo_id;
  this.photo_url = photo_url;
  this.attr = function() {
    return request.getPhoto( this.photo_id );
  };
  this.image = function() {
    return $('<img />').attr({ class: 'collection_photo', 'id': this.header + "_" + this.photo_id, 'src': this.photo_url })
  };
  this.html = this.image;
};
