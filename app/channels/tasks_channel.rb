class TasksChannel < ApplicationCable::Channel
  def subscribed
    stream_from "test_channel"
  end

  def check(data)
    task = Task.find(data['id'])
    task.update! done: true
  end

  def uncheck
    task = Task.find(data['id'])
    task.update! done: false
  end

  def toggle(data)
    task = Task.find(data['id'])
    task.update! done: data['state']
    ActionCable.server.broadcast "test_channel", id: data['id'], state: data['state']
  end
end
