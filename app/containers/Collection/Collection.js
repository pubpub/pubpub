import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch } from 'react-router-dom';
import PubPreview from 'components/PubPreview/PubPreview';
import Footer from 'components/Footer/Footer';

require('./collection.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class Collection extends Component {
	componentWillMount() {
		// Check that it's a valid page slug
		// If it's not - show 404
		// Grab the data for the page
	}

	render() {
		// On appdata load - get a list of all pages - so 
		// we can show titles and check slugs immediately.

		if (this.props.match.params.slug === undefined) {
			console.log('On Home page');
		}

		const contributors = [1, 2, 3, 4, 5];
		const authors = [
			{
				id: 0,
				userInitials: 'TR',
				userAvatar: '/dev/trich.jpg',
			},
			{
				id: 1,
				userInitials: 'MW',
			},
			{
				id: 2,
				userInitials: 'TW',
				userAvatar: '/dev/tomer.jpg',
			},
		];

		const activeSlug = this.props.match.params.slug || '';
		const activeItem = this.props.appData.collections.reduce((prev, curr)=> {
			if (activeSlug === curr.slug) { return curr; }
			return prev;
		}, {});

		return (
			<div>
				<div className={'collection'}>
					<Helmet>
						<title>{activeItem.title || activeSlug}</title>
					</Helmet>

					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<h1>{activeItem.title || activeSlug}</h1>
							</div>
						</div>

						<div className={'row'}>
							<div className={'col-12'}>
								<PubPreview
									title={'Super Glue Data Engine'}
									description={'Media data accessible through APIs to build diverse applications'}
									slug={'my-article'}
									bannerImage={'/dev/banner1.jpg'}
									isLarge={true}
									publicationDate={String(new Date())}
									contributors={contributors}
									authors={authors}
								/>
							</div>
						</div>
						<div className={'row'}>
							<div className={'col-12'}>
								<PubPreview
									title={'Super Glue Data Engine'}
									description={'Media data accessible through APIs to build diverse applications'}
									slug={'my-article'}
									bannerImage={'/dev/banner1.jpg'}
									isLarge={false}
									publicationDate={String(new Date())}
									contributors={contributors}
									authors={authors}
								/>
							</div>
						</div>
						<div className={'row'}>
							<div className={'col-12'}>
								<PubPreview
									title={'Super Glue Data Engine'}
									description={'Media data accessible through APIs to build diverse applications'}
									slug={'my-article'}
									bannerImage={'/dev/banner2.jpg'}
									isLarge={false}
									publicationDate={String(new Date())}
									contributors={[]}
									authors={[authors[2]]}
								/>
							</div>
						</div>
					</div>
				</div>

				<Footer />
			</div>
		);
	}
}

Collection.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(Collection));
