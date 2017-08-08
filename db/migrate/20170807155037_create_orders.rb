class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string :pedido
      t.string :persona

      t.timestamps null: false
    end
  end
end
