function attachCreateRestaurantButton() {
  $(function() {
    $('#add-to-restaurant-button').attr('disabled', 'disabled');
    $('#create-restaurant-button').click(function() {
      var restaurantName = $('#restaurant-name-input').val();
      $.post('/create_restaurant/', {'name' : restaurantName}, function(success) {
        console.log(success);
        if (success.is_created) {
          $('#restaurant-panel').html('<h3><div class="panel-heading" id="panel-restaurant-name">' + restaurantName + '</div></h3>');
          $('#restaurant-id').text(success.restaurant_id);
          $('#add-to-restaurant-button').removeAttr('disabled');
          console.log(success);
        }
        else {
          $('#restaurant-created-alert').alert();
          console.log(success);
        }
      }, 'json');
    });
  });
}

function attachSignUpButton() {
  $(function() {
    $('#add-to-restaurant-button').click(function() {
      var username = $('#username-input').val();
      var restaurantId = $('#restaurant-id').text();
      $.getJSON('/check_user/', {'username' : username}, function(isNewStatus) {
        if (isNewStatus.isNew) {
          $('#modal-register').modal('toggle');
        }
        else {
          $.post('/set_user_to_restaurant/', {'restaurant_id' : restaurantId}, function(success) {
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
        if (success.is_created) {
          var restaurantId = $('#restaurant-id').text();
          $.post('/set_user_to_restaurant/', {'username' : username, 'restaurant_id' : restaurantId}, function(success) {
            window.location = '/m/'
          });
        }
        else {
          // put in error popup
        }
      })
    });
  })
}