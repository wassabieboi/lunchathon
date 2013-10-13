class User < ActiveRecord::Base
  belongs_to :restaurant
  attr_accessible :username, :displayname

  validates :username, :uniqueness => true, :presence => true
  validates :displayname, :presence => true
end
