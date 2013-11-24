class Restaurant < ActiveRecord::Base
  has_many :users
  attr_accessible :name, :is_active

  scope :top5,
    select("restaurants.id, restaurants.name, max(users.username), max(users.displayname), count(users.id) as user_count").
    joins("LEFT JOIN users on users.restaurant_id = restaurants.id").
    where("restaurants.is_active" => true).
    group("restaurants.id").
    order("user_count DESC, restaurants.id ASC").
    limit(5)

  scope :all_by_desc_users,
    select("restaurants.id, restaurants.name, max(users.username), max(users.displayname), count(users.id) as user_count").
    joins("LEFT JOIN users on users.restaurant_id = restaurants.id").
    where("restaurants.is_active" => true).
    group("restaurants.id").
    order("user_count DESC, restaurants.id ASC")

  validates :name, :uniqueness => true, :presence => true
end
