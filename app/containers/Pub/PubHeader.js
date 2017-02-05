import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import { Link } from 'react-router';
// import dateFormat from 'dateformat';
import { FollowButton } from 'containers';
import { Tag } from 'components';
import { contrastText } from 'utils/contrastText';
import PubNav from './PubNav';
import PubLabelList from './PubLabelList';


let styles;

export const PubHeader = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		accountId: PropTypes.number,
		preservedQuery: PropTypes.object,
		currentVersion: PropTypes.object,
		meta: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	render: function() {
		const pub = this.props.pub || {};
		const query = this.props.query;
		const pathname = this.props.pathname;

		const contributors = pub.contributors || [];
		const versions = pub.versions || [];
		const followers = pub.followers || [];
		const pubFeatures = pub.pubFeatures || [];
		
		const contextJournal = pubFeatures.reduce((previous, current)=> {
			if (!query.context && current.journalId === pub.defaultContext) { return current.journal; }
			if (current.journal.title === query.context) { return current.journal; }
			return previous;
		}, undefined);

		const displayedFeatures = pubFeatures.filter((feature)=> {
			return feature.isDisplayed && (!contextJournal || feature.journalId !== contextJournal.id);
		});

		const followData = followers.reduce((previous, current)=> {
			if (current.id === this.props.accountId) { return current.FollowsPub; }
			return previous;
		}, undefined);

		const globalLabels = pub.labels.filter((label)=> {
			return !label.userId && !label.journalId && !label.pubId;
		});

		const pubDOI = versions.reduce((previous, current)=> {
			if (current.doi) { return current.doi; }
			return previous;
		}, undefined);

		let headerImage;
		// headerImage = 'http://www.hotel-r.net/im/hotel/au/naturescape-23.jpg';
		headerImage = 'http://www.wallpaperun.com/wp-content/uploads/2016/02/Galaxy-Wallpapers-Cool-K1N.jpg';
		// headerImage = 'http://www.jpl.nasa.gov/images/msl/20140203/pia17931-640.jpg';
		// headerImage = 'https://i.ytimg.com/vi/LJb0VAcK6N0/maxresdefault.jpg';
		// headerImage = 'http://wallpapercave.com/wp/fRYYDpF.jpg';
		// headerImage = 'http://www.homebusinessandfamilylife.com/admin/slide/1474636405unnamed.jpg';
		// headerImage = 'http://i.imgur.com/Zpx3pcV.jpg';
		headerImage = 'http://ellarow.com/i/2017/01/elephant-black-and-white-wallpapers-picture.jpg';
		headerImage = 'https://static.vecteezy.com/system/resources/previews/000/111/495/original/abstract-colored-cubes-background-vector.jpg';
		headerImage = '';
		const hasHeaderImage = !!pub.headerImage;
		const useLightText = hasHeaderImage ? true : contrastText(pub.headerColor || '#f3f3f4') === '#ffffff';

		// LightHover rgba(167, 182, 194, 0.3)
		return (
			<div style={styles.container}>
				<Style rules={{
					'.button-wrapper .pt-button .pt-icon, .button-wrapper .pt-button .pt-icon-standard, .button-wrapper .pt-button .pt-icon-large, .button-wrapper .pt-button[class*="pt-icon-"]::before': { color: useLightText ? '#BFCCD6' : '#5c7080' },
					'.button-wrapper .pt-button-group .pt-button:not(.pt-intent-danger)': { color: useLightText ? '#f5f8fa' : 'inherit' },
					'.button-wrapper .pt-button-group .pt-button': { minHeight: '24px', lineHeight: '24px' },
					'.button-wrapper .pt-button-group .pt-button:not(.pt-intent-danger)::after': { background: useLightText ? 'rgba(255, 255, 255, 0.15)' : 'rgba(16, 22, 26, 0.15)' },
					'.button-wrapper .pt-button-group .pt-button:not(.pt-intent-danger):hover': { color: useLightText ? '#f5f8fa' : '#182026' },
					'.button-wrapper .pt-button-group:not(.pt-minimal) .pt-button:not(.pt-intent-danger)': { boxShadow: '0px 0px 0px white', backgroundColor: 'transparent', background: 'transparent', border: '1px solid #fff', borderColor: useLightText ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)' },
					'.button-wrapper .pt-button-group:not(.pt-minimal) .pt-button:not(.pt-intent-danger):hover': { backgroundColor: 'rgba(167, 182, 194, 0.3)' },

					// '.button-wrapper .pt-minimal .pt-button .pt-icon, .button-wrapper .pt-minimal .pt-button .pt-icon-standard, .button-wrapper .pt-minimal .pt-button .pt-icon-large, .button-wrapper .pt-minimal .pt-button[class*="pt-icon-"]::before': { color: useLightText ? '#BFCCD6' : '#5c7080' },
					// '.button-wrapper .pt-minimal.pt-button-group .pt-button': { color: useLightText ? '#f5f8fa' : 'inherit'},
					// '.button-wrapper .pt-button-group .pt-button': { minHeight: '24px', lineHeight: '24px' },
					// '.button-wrapper .pt-minimal.pt-button-group .pt-button::after': { background: useLightText ? 'rgba(255, 255, 255, 0.15)' : 'rgba(16, 22, 26, 0.15)' },
					// '.button-wrapper .pt-minimal.pt-button-group .pt-button:hover': { color: useLightText ? '#f5f8fa' : '#182026' },					
				}} />

				{hasHeaderImage &&
					<div style={styles.backgroundImage(pub.headerImage)} />
				}

				<div style={styles.backgroundContainer(hasHeaderImage, pub.headerColor)} />
				
				{hasHeaderImage &&
					<div style={styles.backgroundBottomShadow} />
				}
				
				<div style={styles.content(hasHeaderImage)}>

					{/* ------------ */}
					{/*  Button Box  */}
					{/* ------------ */}
					<div style={styles.buttonsWrapper}>
						<div style={styles.buttonWrapper} className={'button-wrapper'}>
							<FollowButton
								pubId={pub.id}
								followData={followData}
								followerCount={followers.length}
								followersLink={{ pathname: '/pub/' + pub.slug + '/followers', query: query }}
								dispatch={this.props.dispatch} />
						</div>

						<div style={styles.buttonWrapper} className={'button-wrapper'}>
							<div className={'pt-button-group'}>
								<Link to={`/pub/${pub.slug}/versions`} className={'pt-button pt-icon-edit'}>Edit Pub</Link>
								{/*<Link to={'/pub/${pub.slug}/forks'} className={'pt-button pt-icon-fork'}>15</Link>*/}
								{/*<Link to={'/pub/${pub.slug}/forks'} className={'pt-button'}>15</Link>*/}
							</div>
						</div>

						{/*<div style={styles.buttonWrapper} className={'button-wrapper'}>
							<div className={'pt-button-group'}>
								<Link to={`/pub/${pub.slug}/cite`} className={'pt-button pt-icon-bookmark'}>Cite</Link>
								{pubDOI &&
									<a href={'https://doi.org/' + pubDOI} target={'_blank'} className={'pt-button'}>DOI {pubDOI}</a>
								}
							</div>
						</div>	*/}
						
					</div>

					{/* ---------- */}
					{/*  Features  */}
					{/* ---------- */}
					{/*<div style={styles.featuresWrapper}>
						{!!displayedFeatures.length &&
							<div style={styles.journalHeader}>
								{false && !!contextJournal &&
									<div>also featured in:</div>
								}

								{displayedFeatures.sort((foo, bar)=> {
									// Sort so that least recent is first in array
									if (foo.createdAt > bar.createdAt) { return 1; }
									if (foo.createdAt < bar.createdAt) { return -1; }
									return 0;
								}).map((feature)=> {
									const journal = feature.journal || {};
									return (
										<Link to={'/' + journal.slug} key={'header-feature-' + feature.journalId} style={styles.journalHeaderTag}>
											<img alt={journal.title} src={journal.avatar} style={styles.journalHeaderImage(!!headerImage)} />
											<div style={[styles.journalHeaderTitle, { backgroundColor: journal.headerColor, color: contrastText(journal.headerColor) }]}>{journal.title}</div>
											<Tag backgroundColor={journal.headerColor} isLarge={true}>{journal.title}</Tag>
										</Link>
									);
								})}
							</div>
						}
					</div>*/}


					{/* ------------ */}
					{/*  Labels  */}
					{/* ------------ */}
					<div style={styles.labelsWrapper}>
						<PubLabelList selectedLabels={globalLabels} pubId={pub.id} rootPubId={pub.id} globalLabels={true} canEdit={pub.canEdit} pathname={pathname} labelStyle={styles.label(useLightText)} query={query} dispatch={this.props.dispatch} />
					</div>
					
					{/* ------------ */}
					{/*    Title     */}
					{/* ------------ */}
					<div style={styles.title(useLightText)}>
						{pub.title}
					</div>

					{/* ------------ */}
					{/*   Authors    */}
					{/* ------------ */}
					<div style={styles.authorsWrapper(useLightText)}>
							{contributors.filter((contributor)=>{
								return contributor.isAuthor === true;
							}).map((contributor, index, array)=> {
								const user = contributor.user || {};
								return <Link style={styles.authorLink} to={'/user/' + user.username} key={'contributor-' + index}>{user.firstName + ' ' + user.lastName}{index !== array.length - 1 ? ', ' : ''}</Link>;
							})}
					</div>

				</div>

				<div style={styles.navWrapper}>
					<PubNav
						pub={this.props.pub}
						accountId={this.props.accountId}
						preservedQuery={this.props.preservedQuery}
						currentVersion={this.props.currentVersion}
						useLightText={useLightText}
						meta={this.props.meta}
						pathname={this.props.pathname}
						query={this.props.query}
						dispatch={this.props.dispatch} />
				</div>
				
			</div>
		);
	}
});

export default Radium(PubHeader);

styles = {
	container: {
		borderBottom: '1px solid rgba(16, 22, 26, 0.15)',
		position: 'relative',
	},
	backgroundImage: (image)=> {
		return {
			backgroundImage: `url("${image}")`,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center center',
			backgroundSize: 'cover',
			position: 'absolute',
			width: '100%',
			height: '100%',
			zIndex: 1,
		};
	},
	backgroundContainer: (hasHeaderImage, headerColor)=> {
		return {
			backgroundColor: hasHeaderImage ? 'rgba(16, 22, 26, 0.6)' : headerColor || '#F3F3F4',
			position: 'absolute',
			width: '100%',
			height: '100%',
			zIndex: 1,
		};
	},
	backgroundBottomShadow: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		bottom: 0,
		zIndex: 2,
		backgroundImage: 'linear-gradient(-180deg, rgba(24,32,38,0.00) 78%, #182026 100%)',
	},
	content: (hasHeaderImage)=> {
		return {
			maxWidth: '1200px',
			margin: '0 auto',
			padding: hasHeaderImage ? '100px 2em' : '50px 2em',
			position: 'relative',
			zIndex: 3,
		};
	},
	navWrapper: {
		position: 'relative',
		zIndex: 3,
	},
	featuresWrapper: {
		margin: '20px 0px',
		minHeight: '1px',
		// backgroundColor: 'rgba(255, 0, 0, 0.25)',
	},
	buttonsWrapper: {
		margin: '0px 0px',
		// backgroundColor: 'rgba(0, 255, 0, 0.25)',
		float: 'right',
		textAlign: 'right',
		paddingLeft: '1em',
	},
	buttonWrapper: {
		marginBottom: '1em',
		// borderRadius: '2px',
		// display: 'inline-block',
		// border: '1px solid #CCC',
		// marginRight: '0.5em',
	},
	labelsWrapper: {
		marginBottom: '20px', // Equal to height of labels
		// backgroundColor: 'rgba(125, 255, 0, 0.25)',
	},
	label: (useLightText)=> {
		return {
			color: useLightText ? '#F5F8FA' : '#182026',
			backgroundColor: 'rgba(138, 155, 168, 0.4)',
		};
		
	},
	title: (useLightText)=> {
		return {
			fontSize: '2.25em',
			color: useLightText ? '#FFF' : '#10161A',
			// letterSpacing: '-1px',
			fontWeight: '500',
			marginBottom: '20px'
		};
		
	},
	authorsWrapper: (useLightText)=> {
		return {
			// backgroundColor: 'rgba(125, 125, 50, 0.25)',	
			marginBottom: '20px',
			fontStyle: 'italic',
			color: useLightText ? 'rgba(255, 255, 255, 0.7)' : '#5C7080',
			letterSpacing: '0px',
			lineHeight: '27px',
		};
	},
	authorLink: {
		color: 'inherit',
	},
	journalHeaderTag: {
		display: 'inline-block',
		marginRight: '0.5em',
	},
	journalHeaderImage: (hasImage)=> {
		return {
			
			width: '35px',
			borderRadius: '35px',
			// display: 'inline-block',
			verticalAlign: 'middle',
			position: 'relative',
			zIndex: 2,
			display: 'none',
		};
		
	},
	journalHeaderTitle: {
		display: 'inline-block',
		verticalAlign: 'middle',
		lineHeight: '25px',
		padding: '0px 15px',
		borderRadius: '3px',
		// position: 'relative',
		// left: '-10px',
		// zIndex: 1,
		boxShadow: '0px 0px 1px #fff',
		
	},
};
