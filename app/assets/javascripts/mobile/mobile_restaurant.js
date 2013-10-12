function getRestaurants() {
  $.getJSON('/get_restaurants', function(restaurants) {
    for (var i = restaurants.length - 1; i >= 0; i--) {
      var currentRestaurant = restaurants[i];
      $('#restaurant-list').append(createRestaurantListGroupItem(currentRestaurant.name, currentRestaurant.count, currentRestaurant.id));
    };
  });
}

function createRestaurantListGroupItem(restaurantName, dinerCount, restaurantId) {
  var restaurantLink = $('<a>', {
    'href' : '/m/restaurant' + restaurantId,
    'class': 'list-group-item',
    'restaurant-id' : restaurantId
  });

  $('<h2>', {
    class: 'list-group-item-heading',
    text: restaurantName
  }).appendTo(restaurantLink);

  $('<p>', {
    class: 'list-group-item-text',
    text: '(' + dinerCount + ' diners)'
  }).appendTo(restaurantLink);

  return restaurantLink;
}