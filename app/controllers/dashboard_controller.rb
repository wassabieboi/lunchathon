class DashboardController < ApplicationController

  respond_to :json

  # front-end must check for is_existing in response, catch if not parsable JSON
  # def login
  #   user = User.exists?(:username => params[:username])
  #   if user
  #     session[:username] = params[:username]
  #     redirect_to dashboard_path
  #   else
  #     new_user = {:username => params[:username], :is_existing => false}
  #     respond_with new_user
  #   end
  # end

  def check_user
    if User.exists?(:username => params[:username])
      session[:username] = params[:username]
      result = {:isNew => false}
      respond_with
    else
      result = {:isNew => true}
    end
    respond_with result
  end

  def logout
    session[:username] = nil
    redirect_to dashboard_path
  end

  def create_user
    user = User.new(:username => params[:username], :displayname => params[:displayname])
    if user.save
      session[:username] = params[:username]
      respond_with true
    else
      flash[:error] = "That user already exists!"
      respond_with false
    end
  end

  def set_user_to_restaurant
    restaurant_to_join = Restaurant.find(params[:restaurant_id])
    user_to_add = User.find_by_username(params[:username])
    
    restaurant_to_join.users << user_to_add
    flash.now[:success] = "Successfully added to " + restaurant_to_join.name
    redirect_to dashboard_path
  end

  def create_restaurant
    restaurant = Restaurant.new(:name => params[:name], :is_active => true)
    if restaurant.save
      redirect_to dashboard_path
    else
      flash[:error] = "That restaurant is already suggested!"
      redirect_to dashboard_path
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
