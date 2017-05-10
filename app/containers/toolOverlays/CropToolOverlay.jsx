const {compose} = require('redux');
const {connect} = require('react-redux');
const {DragSource} = require('react-dnd');

const {dnd} = require('../../constants');

const CropToolOverlay = require('../../components/toolOverlays/CropToolOverlay');

const {
  updateToolData,
} = require('../../actions/ToolActions');

const mapStateToProps = ({page: {image, tool: {data}}}, ownProps) => ({
  cropX: data.x,
  cropY: data.y,
  cropWidth: data.width,
  cropHeight: data.height,
  maxWidth: image.width,
  maxHeight: image.height,
  ...ownProps,
});

const mapDispatchToProps = (dispatch) => ({
  onChange(data) {
    dispatch(updateToolData(data));
  },
});

const cropSource = {
  beginDrag(props) {
    return {};
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

module.exports = compose(
  connect(mapStateToProps, mapDispatchToProps),
  DragSource(dnd.types.crop, cropSource, collect)
)(CropToolOverlay);
