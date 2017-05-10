const React = require('react');

const DragHandle = require('./DragHandle');

const AdjustableBox = React.createClass({
  propTypes: {
    x: React.PropTypes.any.isRequired,
    y: React.PropTypes.any.isRequired,
    width: React.PropTypes.any.isRequired,
    height: React.PropTypes.any.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
  },

  render() {
    const {x, y, width, height, connectDragSource} = this.props;

    const handles = [
      {x: x, y: y},
      {x: x + width, y: y},
      {x: x + width, y: y + height},
      {x: x, y: y + height},
    ];

    return connectDragSource(
      <div>
        {handles.map(({x, y}, index) => (
          <DragHandle key={index} x={x} y={y}
            isDragging={false/*TODO*/} />
        ))}
      </div>
    );
  },
});

module.exports = AdjustableBox;
