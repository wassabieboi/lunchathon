function getRestaurantUsers() {
  var restaurantId = $('#restaurant-id').text()
  $.getJSON('/get_users/', {'restaurant_id' : restaurantId}, function(restaurantUsers) {
    $('#panel-restaurant-name').text(restaurantUsers.restaurant_name);
    var users = restaurantUsers.users;
    for (var i = users.length - 1; i >= 0; i--) {
      var currentUser = users[i];
      $('#restaurant-user-table > tbody').append('<tr><td>' + currentUser.displayname + '</td></tr>');
    };
  });
}

function attachSignUpButton() {
  $(function() {
    $('#add-to-restaurant').click(function() {
      var username = $('#username-input').val();
      $.getJSON('/check_user/', {'username' : username}, function(isNew) {
        console.log(isNew);
        if (isNew) {
          $('#register-modal').modal('toggle');
        }
      });
    });
  });
}