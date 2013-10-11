class FixIsActiveColumnName < ActiveRecord::Migration
  def change
    rename_column :restaurants, :isActive, :is_active
  end
end
