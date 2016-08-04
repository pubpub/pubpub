import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {PreviewCard} from 'components';
import {safeGetInToJS} from 'utils/safeParse';


export const AtomReaderFollowers = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {
		const followersData = safeGetInToJS(this.props.atomData, ['followersData']) || [];

		return (

			<div>
          <h3>Followers</h3>

        {
          followersData.sort((foo, bar)=>{
            // Sort so that most recent is first in array
            if (foo.createDate > bar.createDate) { return -1; }
            if (foo.createDate < bar.createDate) { return 1; }
            return 0;
          }).map((item, index)=>{
            if (!item.destination) { return null; }
            return (
              <PreviewCard
                key={'featured-' + index}
                type={'user'}
                image={item.source.image}
                title={item.source.username}
                slug={item.source.slug}
                description={item.source.description} />
            );
          })
        }
      </div>
		);
	}
});

export default Radium(AtomReaderFollowers);
