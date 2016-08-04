import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

export const UserProfileFollowing = React.createClass({
  propTypes: {
    profileData: PropTypes.object,
  },

  getInitialState: function() {
    return {

    };
  },

  render: function() {
    const followingData = safeGetInToJS(this.props.profileData, ['profileData', 'following']) || [];

    return (
      <div className={'firstChildNoTopMargin'}>
        {
          followingData.sort((foo, bar)=>{
            // Sort so that most recent is first in array
            if (foo.createDate > bar.createDate) { return -1; }
            if (foo.createDate < bar.createDate) { return 1; }
            return 0;
          }).map((item, index)=>{
            if (!item.destination) { return null; }
            if (item.destination.username) {
              return (
                <PreviewCard
                  key={'featured-' + index}
                  type={'user'}
                  image={item.destination.image}
                  title={item.destination.username}
                  slug={item.destination.slug} />
              );
            }
            if (item.destination.journalName) {
              return (
                <PreviewCard
                  key={'featured-' + index}
                  type={'journal'}
                  image={item.destination.icon}
                  title={item.destination.journalName}
                  slug={item.destination.slug} />
              );
            }
            if (item.destination.previewImage) {
              return (
                <PreviewCard
                  key={'featured-' + index}
                  type={'atom'}
                  image={item.destination.previewImage}
                  title={item.destination.title}
                  slug={item.destination.slug}/>
              );
            }
          })
        }

        </div>
      );
    }
  });

  export default Radium(UserProfileFollowing);
