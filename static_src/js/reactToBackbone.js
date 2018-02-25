import Backbone from 'backbone';
import Layout from 'backbone.layoutmanager';
import ReactDOM from 'react-dom';
import React from 'react';

/*
* use:
* const View = reactToBackbone(ReactComponent)
* this.setView('.el', new View())
* */
export default function reactToBackbone(Component) {
  return Layout.extend({
    beforeRender() {
      this._react = ReactDOM.render(
        React.createElement(Component, this.options),
        this.el
      );
      return false;
    }
  });
}
