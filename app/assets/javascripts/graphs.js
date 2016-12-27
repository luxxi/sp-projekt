var tasksIndexSelector = '.tasks-graphs'

$(tasksIndexSelector).ready(function () {
  function drawChart() {
    var itemName = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
    // var itemValue = [ 6, 7, 4, 2, 4, 7, 3, 10, 11, 4, 5, 5 ];
    console.log(tasksByMonths);
    var itemValue = tasksByMonths;

    var opts = {
      stepSize: 1,
      columnSize: 50,
      rowSize: 60,
      margin: 10,
      header: 'Tasks',
      labelColor: '#454552',
      columnColor: '#e85a71',
      lineColor: '#454552',
      lineMarkFont: '0.75rem Arial',
      columnLabelFont: '0.875rem Arial',
      sections: itemName.length,
      maxVal: Math.max.apply(Math, itemValue)
    };

    var canvas = document.querySelector('#canvas');
    var context = canvas.getContext('2d');
    var yScale = (canvas.height - opts.columnSize - opts.margin * 2) / (opts.maxVal);
    var xScale = (canvas.width - opts.rowSize) / (opts.sections + 1);

    // y axis labels and lines
    context.fillStyle = opts.labelColor;
    context.strokeStyle = opts.lineColor;
    context.beginPath();
    context.font = opts.lineMarkFont;
    context.fillText(opts.header, 0, opts.columnSize - opts.margin);
    for (var scale = opts.maxVal, count = 0; scale >= 0; scale = scale - opts.stepSize) {
      var y = opts.columnSize + (yScale * count * opts.stepSize);
      context.fillText(scale, opts.margin, y + opts.margin);
      if (count % 2 === 0) {
        context.moveTo(opts.rowSize, y)
        context.lineTo(canvas.width, y)
      }
      count++;
    }
    context.stroke();

  	// draw bottom labels
    context.font = opts.columnLabelFont;
    context.textBaseline = 'bottom';
    itemValue.forEach(function (e, i) {
      var y = canvas.height - e * yScale;
      context.fillText(itemName[i], xScale * (i + 1), canvas.height - 3);
    });

  	// draw columns
    context.translate(0, canvas.height - opts.margin);
    context.scale(xScale, -1 * yScale);
    context.fillStyle = opts.columnColor;
    itemValue.forEach(function (e, i) {
    	context.fillRect(i + 1.05, 0.07, 0.3, e);
    });
  }


  $( document ).on('turbolinks:load', function() {
    drawChart();
  })
});
