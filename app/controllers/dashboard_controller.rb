class DashboardController < ApplicationController

  respond_to :json

  def dashboard
    restaurants = Restaurant.where(:is_active => true)
    @all_data = []
    restaurants.each do |restaurant|
      @all_data << {"restaurant_name" => restaurant.name, "restaurant_users" => restaurant.users.select("username, displayname")}
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
    restaurant_to_join = Restaurant.find(params[:restaurant_id])
    user_to_add = User.find_by_username(session[:username])
    
    restaurant_to_join.users << user_to_add
    flash.now[:success] = "Successfully added to " + restaurant_to_join.name
    redirect_to mobile_dashboard_path
  end

  def create_restaurant
    restaurant = Restaurant.new(:name => params[:name], :is_active => true)
    if restaurant.save
      # result["is_created"] = true
      # result["restaurant_id"] = restaurant.id
      puts "id" << restaurant.id
      render json: {:is_created => true, :restaurant_id => restaurant.id}
    else
      render json: {:is_created => false}
    end
  end

  def get_restaurants
    results = []
    restaurants = Restaurant.where(:is_active => true).select("name, id").to_a
    restaurants.each do |r|
      results << {:id => r.id, :name => r.name, :count => r.users.count}
    end
    respond_with(results)
  end

  def get_users
    restaurant = Restaurant.find(params[:restaurant_id])
    users = restaurant.users.select('displayname')
    @restaurant_id = params[:restaurant_id]
    results = {:restaurant_name => restaurant.name, :users => users}
    respond_with(results)
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
