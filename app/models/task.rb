class Task < ApplicationRecord

  def is_priority?
    self.priority > 50
  end
end
