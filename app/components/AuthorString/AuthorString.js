import React, { PropTypes } from 'react';

import Link from 'components/Link/Link';

let styles = {};

const AuthorString = ({contributors}) => {
  if (!contributors) {
    return null;
  }
  console.log(contributors);
  return (
    <div>
      {contributors.filter((contributor)=>{
        return (contributor.isAuthor === true && !contributor.isHidden);
      }).map((contributor, index, array)=> {
        const user = contributor.user || {};
        return <Link style={styles.text} to={'/user/' + user.username} key={'contributor-' + index}>{user.firstName + ' ' + user.lastName}{index !== array.length - 1 ? ', ' : ''}</Link>;
      })}
    </div>
  )
};

styles = {
  text: {
    marginBottom: '20px',
    fontStyle: 'italic',
    color: '#5C7080',
    letterSpacing: '0px',
    lineHeight: '27px',
  }
};


export default AuthorString;
