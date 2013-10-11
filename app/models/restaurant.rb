class Restaurant < ActiveRecord::Base
  has_many :users
  attr_accessible :name, :is_active

  validates :name, :uniqueness => true
end
