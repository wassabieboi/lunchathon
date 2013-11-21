var dispatcher = new WebSocketRails("localhost:3000/websocket");

var restaurantChannel = dispatcher.subscribe('restaurants');
restaurantChannel.bind('new_restaurant_main', function(restaurant) {
  $('#restaurant-main-destination').html($('#restaurant-main-source').clone().children());
  createMainRestaurant(restaurant);
  mainQuicksand();
});

restaurantChannel.bind('new_restaurant_aux', function(restaurant) {
  cloneAux();
  createAuxRestaurant(restaurant);
  auxQuicksand();
});

restaurantChannel.bind('new_main_ordering', function(newMainRestaurants) {
// uncomment and comment above for sequential switching
// restaurantChannel.bind('new_main_ordering', function(allNewRestaurants) {
  // var newMainRestaurants = allNewRestaurants.main_restaurants;
  // var newAuxRestaurants = allNewRestaurants.aux_restaurants;

  // if (newAuxRestaurants) {
  //   clearAux();
  //   orderAuxRestaurants(newAuxRestaurants);
  // }

  $('#restaurant-main-destination').html($('#restaurant-main-source div.restaurant-aux-column').clone());
  var newMainLength = newMainRestaurants.length;
  for (var i = 0; i < newMainLength; i++) {
    createMainRestaurant(newMainRestaurants[i]);
  };
  mainQuicksand();
  // uncomment and comment above for sequential switching
  // newAuxRestaurants ? auxThenMainQuicksand() : mainQuicksand();
});

restaurantChannel.bind('new_aux_ordering', function(newAuxRestaurants) {
  clearAux();
  orderAuxRestaurants(newAuxRestaurants);
});

var userChannel = dispatcher.subscribe('users');
userChannel.bind('user_to_new_restaurant', function(userRestaurants) {
  var user = userRestaurants.user;
  var $userLiElement = $('#restaurant-main-source li[data-id="' + user.username + '"]');
  var userInOldRestaurant = userRestaurants.old_restaurant ? ($userLiElement.length ? $userLiElement : false) : false;
  if (userInOldRestaurant) {
    userInOldRestaurant.fadeOut(function() {
      userInOldRestaurant.remove();
      fadeIntoNewRestaurant(createUser(user), userRestaurants.new_restaurant.id);
    });
  }
  else {
    fadeIntoNewRestaurant(createUser(user), userRestaurants.new_restaurant.id);
  }
});

function fadeIntoNewRestaurant($user, newRestaurantId) {
  $user.appendTo($('#restaurant-main-source div[data-id="' + newRestaurantId + '"] .user-list')).hide().fadeIn();
}

function createMainRestaurant(newRestaurant) {
  var $mainRestaurantElement = $('<div/>', {
    class: 'col-lg-2',
    'data-id': newRestaurant.id
  });
  $('<h3/>').text(newRestaurant.name).appendTo($mainRestaurantElement);
  $userList = $('<ul/>').attr('id', 'user-list').appendTo($mainRestaurantElement);
  var users = newRestaurant.users
  if (users) {
    var userLength = users.length
    for (var i = 0; i < userLength; i++) {
      createUser(users[i]).appendTo($userList);
    }
  }
  $mainRestaurantElement.insertBefore($('#restaurant-main-destination div:last-child'));
}

function createAuxRestaurant(newRestaurant) {
  var $auxRestaurantElement = $('<li/>', {
    'data-id': newRestaurant.id
  });
  $('<h4/>').text(newRestaurant.name).appendTo($auxRestaurantElement);
  $auxRestaurantElement.appendTo($('#restaurant-main-source .restaurant-aux-destination'));
}

function createUser(user) {
  return $('<li/>').attr('data-id', user.username).text(user.displayname);
}

function orderAuxRestaurants(auxRestaurants) {
  var auxLength = auxRestaurants.length
  for (var i = 0; i < auxLength; i++) {
    createAuxRestaurant(auxRestaurants[i]);
  };
  auxQuicksand();
}

function cloneAux() {
  $('#restaurant-main-source .restaurant-aux-destination').html($('#restaurant-main-source .restaurant-aux-source').clone().children());
}

function clearAux() {
  $('#restaurant-main-source .restaurant-aux-destination').html('');
}

function auxQuicksand() {
  $('#restaurant-main-source .restaurant-aux-source').quicksand($('#restaurant-main-source .restaurant-aux-destination li'));
}

function mainQuicksand() {
  $('#restaurant-main-source').quicksand($('#restaurant-main-destination .col-lg-2'));
}

function auxThenMainQuicksand() {
  $('#restaurant-main-source .restaurant-aux-source').quicksand($('#restaurant-main-source .restaurant-aux-destination li'), function() {
    mainQuicksand();
  });
}