class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.integer :igdb_id
      t.string :name
      t.text :summary
      t.text :storyline
      t.decimal :rating
      t.decimal :popularity

      t.timestamps
    end
  end
end
