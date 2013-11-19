class RestaurantPushController < WebsocketRails::BaseController
  def initialize_session
    controller_store[:restaurant_count] = 0