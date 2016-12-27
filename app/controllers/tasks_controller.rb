class TasksController < ApplicationController
  before_action :authenticate_user!, except: :tags
  layout 'app'

  def index
    @tasks = Task.order(due: :asc, priority: :desc)
    @tags = ActsAsTaggableOn::Tag.all
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
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
