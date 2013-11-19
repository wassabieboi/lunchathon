class Restaurant < ActiveRecord::Base
  has_many :users
  attr_accessible :name, :is_active

  scope :top5,
    select("restaurants.id, users.username, users.displayname, count(users.id) as user_count").
    joins("LEFT JOIN `users` on users.restaurant_id = restaurants.id").
    group("restaurants.id").
    order("user_count DESC").
    limit(5)

  scope :all_but_top5,
    select("restaurants.id, users.username, users.displayname, count(users.id) as user_count").
    joins(:users).
    group("restaurants.id").
    order("user_count DESC")[5..-1]

  validates :name, :uniqueness => true, :presence => true
end
