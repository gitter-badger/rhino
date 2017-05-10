const React = require('react');
const {getEmptyImage} = require('react-dnd-html5-backend');

const {isSizeInRange, isPositiveCoordinate} = require('../../helpers/validators');

const ToolOverlay = require('../ToolOverlay');
const AdjustableBox = require('../AdjustableBox');

const CropToolOverlay = React.createClass({
  propTypes: {
    cropX: React.PropTypes.any.isRequired,
    cropY: React.PropTypes.any.isRequired,
    cropWidth: React.PropTypes.any.isRequired,
    cropHeight: React.PropTypes.any.isRequired,
    maxWidth: React.PropTypes.number.isRequired,
    maxHeight: React.PropTypes.number.isRequired,

    zoom: React.PropTypes.number.isRequired,
    overlayWidth: React.PropTypes.number.isRequired,
    overlayHeight: React.PropTypes.number.isRequired,
    overlayOffsetX: React.PropTypes.number.isRequired,
    overlayOffsetY: React.PropTypes.number.isRequired,

    connectDragSource: React.PropTypes.func.isRequired,
    connectDragPreview: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    // We keep an internal copy of the state in case
    // the user using the toolbar enters incorrect data
    // we can default to what we have in the state until
    // they correct their input
    return {
      x: this.props.cropX,
      y: this.props.cropY,
      width: this.props.cropWidth,
      height: this.props.cropHeight,
    };
  },

  componentWillReceiveProps(nextProps) {
    const {cropX, cropY, cropWidth, cropHeight, maxWidth, maxHeight} = nextProps;
    const {x, y, width, height} = this.state;

    this.setState({
      x: isPositiveCoordinate(cropX) ? cropX : x,
      y: isPositiveCoordinate(cropY) ? cropY : y,
      width: isSizeInRange(cropWidth, maxWidth) ? cropWidth : width,
      height: isSizeInRange(cropHeight, maxHeight) ? cropHeight : height,
    });
  },

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage());
  },

  render() {
    const {zoom, connectDragSource} = this.props;

    const {x, y, width, height} = this.state;

    return (
      <ToolOverlay {...this.props}>
        <AdjustableBox x={x * zoom} y={y * zoom}
          width={width * zoom} height={height * zoom}
          connectDragSource={connectDragSource} />
      </ToolOverlay>
    );
  },
});

module.exports = CropToolOverlay;
