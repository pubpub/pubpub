import Radium from 'radium';
import ErrorMsg from './ErrorPlugin';

function attachPopup(Component,options,props) {

  const PluginWrapper = React.createClass({
    render() {
      try {
        return (<Component {...this.props} {...this.state} />);        
      } catch (err) {
        console.log(err);
        return (<ErrorMsg>Error rendering {options.name} plugin</ErrorMsg>);
      }
    }
  });
  return PluginWrapper;

};

export default createPubPubPlugin function(reactComponent,options,props) {

  return {
    options: options,
    props: props,
    component: attachPopup(Radium(reactComponent))
  };
};
