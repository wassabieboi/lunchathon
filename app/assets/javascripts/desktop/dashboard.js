var dispatcher = new WebSocketRails("localhost:3000/websocket");

var restaurantChannel = dispatcher.subscribe('restaurants');
restaurantChannel.bind('new_restaurant_main', function(restaurant) {
  $('#restaurant-main-destination').html($('#restaurant-main-source').clone().children());
  var $newRestaurant = $('<div/>', {
    class: 'col-lg-2',
    'data-id': restaurant.name
  }).insertBefore($('#restaurant-main-destination div:last-child'));
  $('<h3/>').text(restaurant.name).appendTo($newRestaurant);
  $('<ul/>').attr('id', 'user-source').appendTo($newRestaurant);
  $('#restaurant-main-source').quicksand($('#restaurant-main-destination .col-lg-2'));
});

restaurantChannel.bind('new_restaurant_aux', function(restaurant) {
  $('#restaurant-main-source .restaurant-aux-destination').html($('#restaurant-main-source .restaurant-aux-source').clone().children());
  var $newAuxRestaurant = $('<li/>', {
    'data-id': restaurant.name
  }).appendTo($('#restaurant-main-source .restaurant-aux-destination'));
  $('<h4/>').text(restaurant.name).appendTo($newAuxRestaurant);
  $('#restaurant-main-source .restaurant-aux-source').quicksand($('#restaurant-main-source .restaurant-aux-destination li'));
});

var userChannel = dispatcher.subscribe('users');
userChannel.bind('user_to_new_restaurant', function(userRestaurants) {
  console.log(userRestaurants);
  var $userLiElement;
  var user = userRestaurants.user;
  if (userRestaurants.old_restaurant) {
    $userLiElement = $('#restaurant-main-source li[data-id="' + user.username + '"]');
    $userLiElement.fadeOut(function() {
      $userLiElement = $userLiElement.remove();
      fadeIntoNewRestaurant($userLiElement, userRestaurants.new_restaurant.id);
    });
  }
  else {
    $userLiElement = $('<li/>').attr('data-id', user.username).text(user.displayname);
    fadeIntoNewRestaurant($userLiElement, userRestaurants.new_restaurant.id);
  }
});

function fadeIntoNewRestaurant(elementToFade, newRestaurantId) {
  elementToFade.appendTo($('#restaurant-main-source div[data-id="' + newRestaurantId + '"] .user-source')).hide().fadeIn();
}