class Task < ApplicationRecord
  belongs_to :user
  acts_as_taggable

  validates :name, presence: true
  validates :due, presence: true
  validates_date :due
  validates :tag_list, presence: true

  def is_priority?
    self.priority > 50
  end
end
