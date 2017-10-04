import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { NonIdealState } from '@blueprintjs/core';
import PubPreview from 'components/PubPreview/PubPreview';
import PubPreviewLoading from 'components/PubPreview/PubPreviewLoading';
import { getSearch } from 'actions/search';

require('./search.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	searchData: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

class Search extends Component {
	constructor(props) {
		super(props);
		const queryObject = queryString.parse(this.props.location.search);
		this.state = {
			searchQuery: queryObject.q || '',
		};
		this.getSearchData = this.getSearchData.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
	}

	componentWillMount() {
		this.getSearchData(this.props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			this.getSearchData(nextProps);
			this.setState({ searchQuery: queryString.parse(nextProps.location.search).q || '' });
		}
	}
	getSearchData(props) {
		const queryObject = queryString.parse(props.location.search);
		const searchTerm = queryObject.q;
		this.props.dispatch(getSearch(searchTerm, this.props.appData.data.id));
	}
	handleSearchChange(evt) {
		this.setState({ searchQuery: evt.target.value });
	}

	handleSearchSubmit(evt) {
		evt.preventDefault();
		this.props.history.push(`/search?q=${this.state.searchQuery}`);
	}

	render() {
		return (
			<div className={'search'}>

				<Helmet>
					<title>Search</title>
				</Helmet>

				<div className={'container narrow'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<form onSubmit={this.handleSearchSubmit}>
								<input
									placeholder={'Search for pubs...'}
									value={this.state.searchQuery}
									onChange={this.handleSearchChange}
									className={'pt-input pt-large pt-fill'}
								/>
							</form>
						</div>
					</div>

					<div className={'row'}>
						<div className={'col-12'}>
							{this.props.searchData.isLoading &&
								<div>
									<PubPreviewLoading />
									<PubPreviewLoading />
									<PubPreviewLoading />
								</div>
							}
							{!this.props.searchData.isLoading && this.props.searchData.data && this.props.searchData.data.length === 0 &&
								<NonIdealState
									title={'No Results'}
									visual={'pt-icon-search'}
								/>
							}
							{!this.props.searchData.isLoading && this.props.searchData.data && !!this.props.searchData.data.length &&
								<div>
									{this.props.searchData.data.map((pub)=> {
										return (
											<div className={'preview-wrapper'} key={`result-${pub.id}`}>
												<PubPreview
													title={pub.title}
													description={pub.description}
													slug={pub.slug}
													bannerImage={pub.avatar}
													isLarge={false}
													publicationDate={pub.updatedAt}
													contributors={pub.contributors.filter((item)=> {
														return !item.Contributor.isAuthor;
													})}
													authors={pub.contributors.filter((item)=> {
														return item.Contributor.isAuthor;
													})}
												/>
											</div>
										);
									})}
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Search.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app,
	searchData: state.search
}))(Search));
