$(function() {
  getRestaurants();  
})

function getRestaurants() {
  $.getJSON('/get_restaurants', function(restaurants) {
    for (var i = restaurants.length - 1; i >= 0; i--) {
      console.log(restaurants[i].name);
      $('#restaurant-list').append(createRestaurantListGroupItem(restaurants[i].name, restaurants[i].count));
    };
  });
}

function createRestaurantListGroupItem(restaurantName, dinerCount) {
  var restaurantLink = $('<a>', {
    'href' : '#',
    'class': 'list-group-item'}
  );

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