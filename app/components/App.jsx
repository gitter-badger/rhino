const React = require('react');
const {DragDropContext} = require('react-dnd');
const HTML5Backend = require('react-dnd-html5-backend');

require('../../scss/index.scss');

const {app} = require('../../scss/components/app.scss');

const App = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },

  render() {
    const {children} = this.props;

    return (
      <div className={app}>
        {children}
      </div>
    );
  },
});


module.exports = DragDropContext(HTML5Backend)(App);
