class CreateTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.string :description
      t.integer :priority
      t.integer :difficulty
      t.date :due

      t.timestamps
    end
  end
end
