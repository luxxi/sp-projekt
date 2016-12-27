class TasksController < ApplicationController
  before_action :authenticate_user!, except: :tags
  layout 'app'

  def index
    @tasks = current_user.tasks.order(due: :asc, priority: :desc)
    @tags = @tasks.map(&:tag_list).flatten
  end

  def new
    @task = Task.new
  end

  def create
    @task = current_user.tasks.new(task_params)
    if @task.save
      redirect_to tasks_path, notice: 'Task was successfully created.'
    else
      render :new
    end
  end

  def edit
    @task = Task.find(params[:id])
  end

  def update
    @task = Task.find(params[:id])
    if @task.update(task_params)
      redirect_to tasks_path, notice: 'Task was successfully updated.'
    else
      render :edit
    end
  end

  def graphs
    group = current_user.tasks.group_by {|t| t.due.month }
    count = group.each {|k,v| group[k] = v.size }
    months = (1..12).to_a.map {|e| [e, 0]}.to_h
    @num_tasks_by_months = months.merge!(count).values
  end

  def tags
    tags = ActsAsTaggableOn::Tag.all.pluck(:name)
    tags.map! {|tag| "#"+tag }
    respond_to do |format|
      format.json { render json: tags }
    end
  end

  private
    def task_params
      params.require(:task).permit(:name, :description, :priority, :difficulty, :due, :tag_list)
    end
end
