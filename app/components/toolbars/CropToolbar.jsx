const PropTypes = require('prop-types');
const React = require('react');
const CloseOnEscape = require('react-close-on-escape').default;
const Icon = require('react-fontawesome');

const {isSizeInRange, isPositiveCoordinate} = require('../../helpers/validators');

const Navbar = require('../Navbar');
const NavbarButton = require('../NavbarButton');
const NavbarText = require('../NavbarText');
const Form = require('../Form');
const FormGroup = require('../FormGroup');
const Label = require('../Label');
const Input = require('../Input');

class CropToolbar extends React.Component {
  static propTypes = {
    x: PropTypes.any.isRequired,
    y: PropTypes.any.isRequired,
    width: PropTypes.any.isRequired,
    height: PropTypes.any.isRequired,
    maxWidth: PropTypes.number.isRequired,
    maxHeight: PropTypes.number.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    onCancel() {},
    onSubmit() {},
  };

  validate = () => {
    const {x, y, width, height, maxWidth, maxHeight} = this.props;
    return (
      isPositiveCoordinate(x) && isPositiveCoordinate(y) &&
      isSizeInRange(width, maxWidth) && isSizeInRange(height, maxHeight)
    );
  }

  numberHandler = (prop, event) => {
    const value = parseFloat(event.target.value);
    this.props.onChange({[prop]: isNaN(value) ? '' : value});
  }

  render = () => {
    const {x, y, width, height, maxWidth, maxHeight, onCancel, onSubmit} = this.props;

    const submit = (e) => {
      e.preventDefault();
      onSubmit({x, y, width, height});
    };

    return (
      <Navbar>
        <CloseOnEscape onEscape={onCancel}><span /></CloseOnEscape>
        <Form layout='horizontal' onSubmit={submit}>
          <NavbarText>Crop</NavbarText>

          <FormGroup layout='horizontal' isValid={isPositiveCoordinate(x)}>
            <Label>x</Label>
            <Input type='number' min={0} value={x}
              onChange={this.numberHandler.bind(this, 'x')} />
          </FormGroup>

          <FormGroup layout='horizontal' isValid={isPositiveCoordinate(y)}>
            <Label>y</Label>
            <Input type='number' min={0} value={y}
              onChange={this.numberHandler.bind(this, 'y')} />
          </FormGroup>

          <FormGroup layout='horizontal' isValid={isSizeInRange(width, maxWidth)}>
            <Label>width</Label>
            <Input type='number' min={1} value={width}
              onChange={this.numberHandler.bind(this, 'width')} />
          </FormGroup>

          <FormGroup layout='horizontal' isValid={isSizeInRange(height, maxHeight)}>
            <Label>height</Label>
            <Input type='number' min={1} value={height}
              onChange={this.numberHandler.bind(this, 'height')} />
          </FormGroup>

          <NavbarButton title='Apply' onClick={submit} disabled={!this.validate()}>
            <Icon name='check' />
          </NavbarButton>

          <NavbarButton title='Cancel' onClick={onCancel}>
            <Icon name='ban' />
          </NavbarButton>

          {/* Without some kind of submit button, the form cannot be submitted with the enter key */}
          <Input type='submit' disabled={!this.validate()}
            style={{position: 'absolute', left: -999999}} />
        </Form>
      </Navbar>
    );
  }
}

module.exports = CropToolbar;
