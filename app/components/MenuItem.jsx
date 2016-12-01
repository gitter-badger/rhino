const React = require('react');
const classNames = require('classnames');

const {
  menuItem,
  menuItemRight,
  menuItemDisabled,
} = require('../../scss/components/menuBar.scss');

const MenuItem = ({
  label,
  accelerator,
  className,
  disabled = false,
  ...props
}) => (
  <li {...props} className={classNames({
    [menuItem]: true,
    [menuItemDisabled]: disabled,
  }, className)}>
    {label}
    {accelerator ?
      <span className={menuItemRight}>{accelerator.replace('CommandOrControl', 'Ctrl')}</span>
      : null
    }
  </li>
);

MenuItem.propTypes = {
  label: React.PropTypes.node,
  accelerator: React.PropTypes.string,
  className: React.PropTypes.string,
  disabled: React.PropTypes.bool,
};

module.exports = MenuItem;
