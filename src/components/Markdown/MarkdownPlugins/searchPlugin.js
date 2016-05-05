import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';
import { Link } from 'react-router';
import {Autocomplete} from 'containers';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

const InputFields = [
	{title: 'fontColor', type: 'text', params: {placeholder: '#222'}},
	{title: 'bottomLineColor', type: 'text', params: {placeholder: '#222'}},
	{title: 'placeholderText', type: 'text', params: {placeholder: 'Search Pubs'}},
	{title: 'placeholderColor', type: 'text', params: {placeholder: '#CCC'}},
];

const Config = {
	title: 'search',
	autocomplete: true,
	preview: false,
	color: 'rgba(185, 215, 249, 0.5)',
	page: true,
};

const EditorWidget = (inputProps) => (<span>Search</span>);

const Plugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,

		fontColor: PropTypes.string,
		bottomLineColor: PropTypes.string,
		placeholderText: PropTypes.string,
		placeholderColor: PropTypes.string,

	},

	renderLandingSearchResults: function(results) {
		// console.log(results);
		return (
			<div className={'searchResults'}>
				{
					results.map((item, index)=>{
						const url = '/pub/' + item.slug;
						return (<div key={'landingSearchResult-' + index} className={'searchResult'}>
							<Link key={'landingSearchResultLink-' + index} className={'searchResultLink'} to={url}>
								<div className={'searchResultTitle'}>{item.title}</div>
								<div className={'searchResultAbstract'}>{item.abstract}</div>
							</Link>

						</div>);
					})
				}

				{results.length === 0
					? <div className={'noResults'}>
						<FormattedMessage {...globalMessages.noResults} />
					</div>
					: null
				}
			</div>
		);
	},

	render: function() {
		return (
			<div className={'searchWrapper'}>
				<Autocomplete
					autocompleteKey={'landingSearch'}
					route={'autocompletePubsForJournal'}
					placeholder={this.props.placeholderText || 'Search Pubs'}
					height={40}
					hideResultsOnClickOut={false}
					resultRenderFunction={this.renderLandingSearchResults}
					loaderOffset={-9}
					padding={'10px 0px'}
					fontColor={this.props.fontColor}
					bottomLineColor={this.props.bottomLineColor}
					searchPlaceholderColor={this.props.placeholderColor}/>
			</div>
		);
	}
});

export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
