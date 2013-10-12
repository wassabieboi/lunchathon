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
      var restaurantId = $('#restaurant-id').text();
      $.getJSON('/check_user/', {'username' : username}, function(isNewStatus) {
        if (isNewStatus.isNew) {
          $('#modal-register').modal('toggle');
        }
        else {
          $.post('/set_user_to_restaurant', {'username' : username, 'restaurant_id' : restaurantId}, function(success) {
            window.location = '/m/'
          });
        }
      });
    });
  });
}

function attachModalRegisterButton() {
  $(function() {
    $('#modal-register-button').click(function() {
      var username = $('#username-input').val();
      var displayname = $('#displayname-input').val();
      $.getJSON('/create_user/', {'username' : username, 'displayname' : displayname}, function(success) {
        if (success.isCreated) {
          var restaurantId = $('#restaurant-id').text();
          $.post('/set_user_to_restaurant', {'username' : username, 'restaurant_id' : restaurantId}, function(success) {
            window.location = '/m/'
          });
        }
      })
    });
  })
}