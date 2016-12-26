App.tasks = App.cable.subscriptions.create "TasksChannel",
  connected: ->
    $(".tasks__checkbox").change =>
      @toggle($(event.target).val(), $(event.target)[0].checked)

  received: (data) ->
    id = parseInt(data.id)
    checkbox = $(".tasks__checkbox[data-id='" + id + "']")[0]
    checkbox.checked = data.state;

  toggle: (id, state)->
    @perform 'toggle', id: id, state: state
