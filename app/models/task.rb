class Task < ApplicationRecord
  acts_as_taggable

  # TODO validation!


  def is_priority?
    self.priority > 50
  end
end
