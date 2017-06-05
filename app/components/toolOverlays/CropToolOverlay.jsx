const PropTypes = require('prop-types');
const React = require('react');
const Draggable = require('react-draggable');

const {isSizeInRange, isPositiveCoordinate} = require('../../helpers/validators');

const Resizeable = require('../Resizeable');
const ToolOverlay = require('../ToolOverlay');

const {
  resizeableDragging,
} = require('../../../scss/components/resizeable.scss');

class CropToolOverlay extends React.Component {
  static propTypes = {
    cropX: PropTypes.any.isRequired,
    cropY: PropTypes.any.isRequired,
    cropWidth: PropTypes.any.isRequired,
    cropHeight: PropTypes.any.isRequired,
    maxWidth: PropTypes.number.isRequired,
    maxHeight: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,

    zoom: PropTypes.number.isRequired,
    overlayWidth: PropTypes.number.isRequired,
    overlayHeight: PropTypes.number.isRequired,
    overlayOffsetX: PropTypes.number.isRequired,
    overlayOffsetY: PropTypes.number.isRequired,
  };

  // We keep an internal copy of the state in case
  // the user using the toolbar enters incorrect data
  // we can default to what we have in the state until
  // they correct their input
  state = {
    x: this.props.cropX,
    y: this.props.cropY,
    width: this.props.cropWidth,
    height: this.props.cropHeight,
  };

  componentWillReceiveProps = (nextProps) => {
    const {cropX, cropY, cropWidth, cropHeight, maxWidth, maxHeight} = nextProps;
    let {x, y, width, height} = this.state;

    x = isPositiveCoordinate(cropX) ? cropX : x;
    y = isPositiveCoordinate(cropY) ? cropY : y;
    width = isSizeInRange(cropWidth, maxWidth) ? cropWidth : width;
    height = isSizeInRange(cropHeight, maxHeight) ? cropHeight : height;

    if (x != this.state.x && y != this.state.y) {
      //FIXME: THIS IS A TERRIBLE HACK
      // This is necessary because the Draggable component does not support
      // the proper API for a controlled component
      // If you try to use the `position` prop on Draggable, the entire component
      // stops responding to user input. This is really not useful behaviour...
      // The solution is to probably replace both Draggable and Resizeable by
      // new components since both of their APIs absolutely suck...
      this.draggable.setState({x, y});
    }

    this.setState({x, y, width, height});
  }

  render = () => {
    const {
      zoom,
      overlayWidth,
      overlayHeight,
      overlayOffsetX,
      overlayOffsetY,
    } = this.props;
    let {x, y, width, height} = this.state;
    x *= zoom;
    y *= zoom;
    width *= zoom;
    height *= zoom;

    return (
      <ToolOverlay {...this.props}>
        <Draggable ref={(node) => this.draggable = node}
          defaultPosition={{x, y}}
          defaultClassNameDragging={resizeableDragging}
          onDrag={(event, {x, y}) => console.log({x, y}) || this.props.onChange({
            x: Math.floor(x / zoom),
            y: Math.floor(y / zoom),
            width: this.state.width,
            height: this.state.height,
          })}
        >
          <Resizeable width={width} height={height}
            onResize={(event, {width, height}) => this.props.onChange({
              x: this.state.x,
              y: this.state.y,
              width: Math.floor(width / zoom),
              height: Math.floor(height / zoom),
            })} />
        </Draggable>
      </ToolOverlay>
    );
  }
}

module.exports = CropToolOverlay;
