const React = require('react');
const {DragLayer} = require('react-dnd');

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

const CropDragLayer = React.createClass({
  propTypes: {
    item: React.PropTypes.object,
    itemType: React.PropTypes.string,
    currentOffset: React.PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
    isDragging: React.PropTypes.bool.isRequired,
  },

  render() {
    const item = this.props.item;
    const isDragging = this.props.isDragging;

    return (
      <div />
    );
  },
});

module.exports = DragLayer(collect)(CropDragLayer);
