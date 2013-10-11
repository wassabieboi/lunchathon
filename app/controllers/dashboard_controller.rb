class DashboardController < ApplicationController

  respond_to :json

  # front-end must check for is_existing in response, catch if not parsable JSON
  def login
    user = User.exists?(:username => params[:username])
    if user
      session[:username] = params[:username]
      redirect_to dashboard_path
    else
      new_user = {:username => params[:username], :is_existing => false}
      respond_with new_user
    end
  end

	def create_user
    user = User.new(:username => params[:username], :displayname => params[:displayname])
    if user.save
      redirect_to dashboard_path
    end
  end

  def create_restaurant
    restaurant = Restaurant.new(:name => params[:name], :is_active => true)
    if restaurant.save
      redirect_to dashboard_path
    else
      # flash.now[:error] = "An error has occurred"
      flash[:notice] = "That restaurant is already suggested!"
      redirect_to dashboard_path
      # flash[:notice] = "hello"
    end
  end


  def get_restaurants
    restaurants = Restaurant.where(:is_active => true).select("name, id")

    respond_with(restaurants)
  end

  def get_all_data
    restaurants = Restaurant.where(:is_active => true)
    all_data = []
    restaurants.each do |restaurant|
      all_data << {"restaurant_name" => restaurant.name, "restaurant_users" => restaurant.users.select("username, displayname")}
    end
    respond_with all_data
  end

  def set_user_to_restaurant
    restaurant_to_join = Restaurant.find(params[:restaurant_id])
    user_to_add = User.find_by_username(params[:username])
    puts restaurant_to_join.users.to_s
    
    restaurant_to_join.users << user_to_add

    redirect_to dashboard_path
  end

end
