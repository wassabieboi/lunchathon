class DashboardController < ApplicationController

  respond_to :json

  def dashboard
    all_restaurants = Restaurant.all_by_desc_users
    @top5 = all_restaurants[0..4] || []
    @rest_of_restaurants = all_restaurants[5..-1] || []
    @request = request
  end

  def mobile
    @restaurants = Restaurant.all_by_desc_users
  end

  def join
    if params[:id] != 'new'
      @restaurant = Restaurant.find(params[:id])
      @users = @restaurant.users
    end
  end

  def check_user
    if User.exists?(:username => params[:username])
      session[:username] = params[:username]
      result = {:isNew => false}
    else
      result = {:isNew => true}
    end
    respond_with result
  end

  def logout
    session[:username] = nil
    redirect_to mobile_dashboard_path
  end

  def create_user
    user = User.new(:username => params[:username], :displayname => params[:displayname])
    if user.save
      session[:username] = params[:username]
      result = {:is_created => true}
    else
      flash[:error] = "That user already exists!"
      result = {:is_created => false}
    end
    respond_with result
  end

  def set_user_to_restaurant
    original_all_by_desc_users = Restaurant.all_by_desc_users
    original_main = original_all_by_desc_users[0..4]
    original_aux = original_all_by_desc_users[5..-1]

    restaurant_to_join = Restaurant.find(params[:restaurant_id])
    user_to_add = User.find_by_username(session[:username])
    original_restaurant = user_to_add.restaurant

    restaurant_to_join.users << user_to_add

    new_all_by_desc_users = Restaurant.all_by_desc_users
    new_main = new_all_by_desc_users[0..4]
    new_aux = new_all_by_desc_users[5..-1]

    user_restaurant = {:user => {:username => Digest::SHA1.base64digest(user_to_add.username), :displayname => user_to_add.displayname}, :old_restaurant => original_restaurant ? original_restaurant.attributes.slice('id', 'name') : nil, :new_restaurant => restaurant_to_join.attributes.slice('id', 'name')}

    WebsocketRails[:users].trigger('user_to_new_restaurant', user_restaurant)

    is_different_aux = original_aux ? original_aux.map {|r| r.id} != new_aux.map {|r| r.id} : false
    new_aux_response = new_aux ? new_aux.map {|r| r.attributes.slice('id', 'name')} : false
    if is_different_aux
      WebsocketRails[:restaurants].trigger('new_aux_ordering', new_aux_response)
    end

    is_different_main = original_main.map {|r| r.id} != new_main.map {|r| r.id}
    if is_different_main
      new_main_response = new_main.map {|r| {:id => r.id, :name => r.name, :users => r.users.map {|u| {:username => Digest::SHA1.base64digest(u.username), :displayname => u.displayname}} }}
      WebsocketRails[:restaurants].trigger('new_main_ordering', new_main_response)
      # uncomment and comment above for sequential switching
      # WebsocketRails[:restaurants].trigger('new_main_ordering', {:main_restaurants => new_main_response, :aux_restaurants => is_different_aux ? new_aux_response : nil})
    end

    flash.now[:success] = "Successfully added to " + restaurant_to_join.name
    redirect_to mobile_dashboard_path
  end

  def create_restaurant
    restaurant = Restaurant.new(:name => params[:name], :is_active => true)
    if restaurant.save
      puts "id" << restaurant.id
      if Restaurant.where(:is_active => true).count <= 5
        event = 'new_restaurant_main'
      else
        event = 'new_restaurant_aux'
      end
      WebsocketRails[:restaurants].trigger(event, restaurant)
      render json: {:is_created => true, :restaurant_id => restaurant.id}
    else
      render json: {:is_created => false}
      # respond_with false
    end
  end

  def get_all_data
    restaurants = Restaurant.where(:is_active => true)
    all_data = []
    restaurants.each do |restaurant|
      all_data << {"restaurant_name" => restaurant.name, "restaurant_users" => restaurant.users.select("username, displayname")}
    end
    respond_with all_data
  end
end
