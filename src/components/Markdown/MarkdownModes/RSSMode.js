import React, {PropTypes} from 'react';

export default {
  processTree: null,
  handleIterate: function(globals, Tag, props, children) {
    switch (Tag) {
      case 'p':
  		  return <p>{children}</p>;
  			break;
    }

    return false;
  }
};
