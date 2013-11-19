var dispatcher = new WebSocketRails("localhost:3000/websocket");

var restaurantChannel = dispatcher.subscribe('restaurants');
restaurantChannel.bind('newrestaurantmain', function(restaurant) {
  $('#restaurant-main-destination').html($('#restaurant-main-source').clone().children());
  var $newRestaurant = $('<div/>', {
    class: 'col-lg-2',
    'data-id': restaurant.name
  }).insertBefore($('#restaurant-main-destination div:last-child'));
  $('<h3/>').text(restaurant.name).appendTo($newRestaurant);
  $('<ul/>').attr('id', 'user-source').appendTo($newRestaurant);
  $('#restaurant-main-source').quicksand($('#restaurant-main-destination .col-lg-2'));
});

restaurantChannel.bind('newrestaurantaux', function(restaurant) {
  $('#restaurant-main-source .restaurant-aux-destination').html($('#restaurant-main-source .restaurant-aux-source').clone().children());
  var $newAuxRestaurant = $('<li/>', {
    'data-id': restaurant.name
  }).appendTo($('#restaurant-main-source .restaurant-aux-destination'));
  $('<h4/>').text(restaurant.name).appendTo($newAuxRestaurant);
  $('#restaurant-main-source .restaurant-aux-source').quicksand($('#restaurant-main-source .restaurant-aux-destination li'));
});

var userChannel = dispatcher.subscribe('users');
userChannel.bind('newuser', function(user) {

});