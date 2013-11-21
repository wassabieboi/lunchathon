class Restaurant < ActiveRecord::Base
  has_many :users
  attr_accessible :name, :is_active

  scope :top5,
    select("restaurants.id, restaurants.name, users.username, users.displayname, count(users.id) as user_count").
    joins("LEFT JOIN `users` on users.restaurant_id = restaurants.id").
    group("restaurants.id").
    order("user_count DESC").
    limit(5)

  scope :all_by_desc_users,
    select("restaurants.id, restaurants.name, users.username, users.displayname, count(users.id) as user_count").
    joins("LEFT JOIN `users` on users.restaurant_id = restaurants.id").
    group("restaurants.id").
    order("user_count DESC")

  validates :name, :uniqueness => true, :presence => true
end
