class AddIsActiveToRestaurants < ActiveRecord::Migration
  def change
    add_column :restaurants, :isActive, :boolean
  end
end
