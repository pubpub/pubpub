import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';
import DiscussionsInput from './DiscussionsInput';
import DiscussionsScore from './DiscussionsScore';

import {Markdown} from 'components';

// import ResizingText from '../../components/PubBody/ResizingText';

// import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage, FormattedDate, FormattedRelative} from 'react-intl';

let styles = {};

const DiscussionsItem = React.createClass({

    //propTypes is essentially a dictionary where you define  what props this component needs
	propTypes: {
		slug: PropTypes.string,
		discussionItem: PropTypes.object,
		// instanceName: PropTypes.string,
		isPubAuthor: PropTypes.bool,
        isParent: PropTypes.bool,

		isCollaborator: PropTypes.bool,
		isPublished: PropTypes.bool,

		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		// newDiscussionData: PropTypes.object,
		userThumbnail: PropTypes.string,
        pubAuthors: PropTypes.object,

		activeSaveID: PropTypes.string,
		handleVoteSubmit: PropTypes.func,
		handleArchive: PropTypes.func,

		toggleMediaLibrary: PropTypes.func,
		// noPermalink: PropTypes.bool,
		// noReply: PropTypes.bool,

	},

	getDefaultProps: function() {
		return {
			discussionItem: {
				selections: [],
				children: [],
			},
		};
	},

	getInitialState() {

        //if markdown takes less height than threshold ... showCompleteText



		return {
			replyActive: false,
			showArchived: false,
            show: true,
            showChilds: true,
            showCompleteText:false
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.addDiscussionStatus === 'loading' && this.props.activeSaveID === this.props.discussionItem._id && nextProps.addDiscussionStatus === 'loaded') {
			this.setState({replyActive: false});
		}
	},

    componentDidMount() {

    //    const h = .refs.chart.innerText

      //  console.log(h)
	},

    toggleReplyActive: function() {
		this.setState({
			replyActive: !this.state.replyActive,
		});
	},

	archive: function() {
		this.props.handleArchive(this.props.discussionItem._id);
	},

	toggleShowArchived: function() {
		this.setState({
			showArchived: !this.state.showArchived
		});
	},
    showMore: function() {
		this.setState({
			showCompleteText: true
		});
	},


	render: function() {

        let authorReplied = false;
		const discussionItem = this.props.discussionItem;
		const isArchived = discussionItem.archived;
		const discussionPoints = discussionItem.points ? discussionItem.points : 0; // This is to fix a NaN problem with newly published comments/discussions
        const commentAuthor = discussionItem.author.username;


      //checking if the comment is a child and it was written by this pub author

        const isChildCommentByThisPubAuthor = (!this.props.isParent && !!(this.props.pubAuthors.find( (author) => {
            return (commentAuthor === author.username);
        })) );

     //checking if author replied to the comment

        for (let i=0; i<discussionItem.children.length;i++){

            const hasChildCommentByThisPubAuthor = (!!(this.props.pubAuthors.find( (author) => {
            return (discussionItem.children[i].author.username === author.username);
                })) );

            if (hasChildCommentByThisPubAuthor){
                authorReplied=true;
            }

    }


		return (
			isArchived && !this.state.showArchived
				? <div style={[styles.archivedContainer, globalStyles.ellipsis]} key={'archiveBlock-' + discussionItem._id} onClick={this.toggleShowArchived}>
					Archived
					<span style={{padding: '0px 20px'}}>Comment by {discussionItem.author.name}</span>
					{(discussionPoints + 1) === 1 ? (discussionPoints + 1) + ' point' : (discussionPoints + 1) + ' points'}
				</div>

				: this.state.show
                ?<div className={'discussion-item'} style={[styles.container(this.state.show, isChildCommentByThisPubAuthor), isArchived && styles.archived]}> {/* The classname discussion-item is used by selectionPlugin*/}

                    <div style={[styles.discussionHeader]}>
						<div style={styles.discussionVoting}>
							<DiscussionsScore
								discussionID={discussionItem._id}
								score={discussionPoints}
								userYay={discussionItem.userYay}
								userNay={discussionItem.userNay}
								handleVoteSubmit={this.props.handleVoteSubmit}/>
						</div>

						<div style={styles.discussionAuthorImageWrapper}>
							<Link to={'/user/' + discussionItem.author.username} style={globalStyles.link}>
								<img style={styles.discussionAuthorImage} src={discussionItem.author.thumbnail} />
							</Link>
						</div>

						<div style={styles.discussionDetailsLine}>

							<Link to={'/user/' + discussionItem.author.username} style={globalStyles.link}>
								<span key={'discussionItemAuthorLink' + discussionItem._id} style={[styles.headerText, styles.authorName(isChildCommentByThisPubAuthor)]}>{discussionItem.author.name}</span>
							</Link>

                            <span style={styles.dot}>●</span>
														<span style={styles.date}>
                            {
								(((new Date() - new Date(discussionItem.createDate)) / (1000 * 60 * 60 * 24)) < 7  )
				            ? <Link style={styles.date} to={'/pub/' + this.props.slug + '/discussions/' + discussionItem._id}><FormattedRelative value={discussionItem.createDate}/></Link>
							: <Link style={styles.date} to={'/pub/' + this.props.slug + '/discussions/' + discussionItem._id}><FormattedDate value={discussionItem.createDate || new Date()} day='numeric' month='short' year='numeric'/></Link>
							}
							</span>

							{(discussionItem.children.length === 0)
							? <div style={[styles.detailLineItem, {display: 'inline-block'}]} onClick={this.collapseButtonClicked} >Hide Discussion (0 Childs)</div>
							: <span style={[styles.detailLineItem, {display: 'inline-block'}]} onClick={this.collapseButtonClicked}>
							{(discussionItem.children.length) === 1
									?<div>Hide Discussion ({discussionItem.children.length} child)</div>
									:  <div>Hide Discussion ({discussionItem.children.length} childs)</div>}
								 {/* {(authorReplied) ?'Author Replied' :''} */} </span>
							}


                        </div>

                        <div style={[styles.discussionDetailsLine,  styles.discussionDetailsLineBottom]}>

                            <span>{discussionItem.bio}</span>

                        </div>


                        <div>
					{/*	<div style={[styles.discussionDetailsLine,  styles.discussionDetailsLineBottom]}>
							<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/discussions/' + discussionItem._id}>
							<span style={[styles.detailLineItem]}>
								<FormattedMessage id="discussion.permalink" defaultMessage="Permalink"/>
							</span>
							</Link> */}

							{/* <span style={[styles.detailLineItemSeparator, !discussionItem.isAuthor && styles.hide]}>|</span>
							<span style={[styles.detailLineItem, !discussionItem.isAuthor && styles.hide]} key={'editButton-' + discussionItem._id} onClick={this.edit}>
								<FormattedMessage id="discussion.edit" defaultMessage="Edit"/>
							</span> */}

							{/* <span style={[styles.detailLineItemSeparator, discussionItem.isAuthor && styles.hide]}>|</span>
							<span style={[styles.detailLineItem, discussionItem.isAuthor && styles.hide]} key={'flagButton-' + discussionItem._id} onClick={this.toggleFlag}>
								<FormattedMessage id="discussion.flag" defaultMessage="Flag"/>
							</span> */}

							{this.props.isPubAuthor
								? <span>
									<span style={[styles.detailLineItemSeparator]}>|</span>
									<span style={[styles.detailLineItem]} key={'archiveButton-' + discussionItem._id} onClick={this.archive}>
										{isArchived
											? <FormattedMessage id="discussion.Unarchive" defaultMessage="Unarchive"/>
											: <FormattedMessage id="discussion.Archive" defaultMessage="Archive"/>
										}
									</span>
								</span>
								: null
							}

							{isArchived
								? <span>
									<span style={[styles.detailLineItemSeparator, (this.props.noReply && this.props.noPermalink && !this.props.isPubAuthor) && {display: 'none'}]}>|</span>
									<span style={[styles.detailLineItem, this.props.noReply && {display: 'none'}]} key={'archiveShowButton-' + discussionItem._id} onClick={this.toggleShowArchived}>
										<FormattedMessage id="discussion.Archived" defaultMessage="Collapse"/>
									</span>
								</span>
								: null
							}

						</div>

					</div>

					{/* <ResizingText
						fontRatio={35}
						mobileFontRatio={20}
						minFont={14}
						maxFont={18}
						paddingType="right"> */}


					<div id="chart" ref="chart" style={styles.discussionBody}>


						<div style={styles.discussionContent}>
							<div style={[styles.privateBlock, discussionItem.private && {display: 'inline-block'}]}>

								<FormattedMessage id="discussion.PrivateCollaboraotrsOnly" defaultMessage="Private. Collaborators only."/>
							</div>
							{/* md.tree */}
							<Markdown markdown={discussionItem.markdown} />

                        {/*<span style={styles.readMore} onClick={this.showMore}>Show More</span>*/}
                        </div>

            <div style={[styles.discussionActionsLine, styles.discussionActionsLineBottom]}>

                {/*<span style={[styles.detailLineItemSeparator, {display: 'inline-block'}]}>|</span> */}
									<span style={[styles.detailLineItem, {display: 'inline-block'}]} key={'replyButton-' + discussionItem._id} onClick={this.toggleReplyActive}>
				<FormattedMessage id="discussion.reply" defaultMessage="Reply"/></span>
            </div>
        </div>

                 <div>

                    {
                    (this.state.showChilds || !this.props.isParent)
					?<div style={styles.discussionChildrenWrapper}>
						{
							discussionItem.children.map((child)=>{
								return (<ChildPubDiscussionItem
									key={child._id}
									slug={this.props.slug}
									discussionItem={child}
									isPubAuthor={this.props.isPubAuthor}
                                    isParent={false}
                                    pubAuthors={this.props.pubAuthors}
									isCollaborator={this.props.isCollaborator}
									isPublished={this.props.isPublished}
									activeSaveID={this.props.activeSaveID}
									addDiscussionHandler={this.props.addDiscussionHandler}
									addDiscussionStatus={this.props.addDiscussionStatus}
									userThumbnail={this.props.userThumbnail}
									handleVoteSubmit={this.props.handleVoteSubmit}
									handleArchive={this.props.handleVoteSubmit}
									toggleMediaLibrary={this.props.toggleMediaLibrary}/>

								);
							})
						}</div>
                    :<div></div>
                     }

                    </div>

					{/* </ResizingText> */}

					{!this.state.replyActive
						? null
						: <div style={[styles.replyWrapper, styles.replyWrapperActive]}>
							<DiscussionsInput
								addDiscussionHandler={this.props.addDiscussionHandler}
								addDiscussionStatus={this.props.addDiscussionStatus}
								userThumbnail={this.props.userThumbnail}
								codeMirrorID={'replyInput-' + discussionItem._id}
								parentID={discussionItem._id}
								isCollaborator={this.props.isCollaborator}
								parentIsPrivate={discussionItem.private}
								saveID={discussionItem._id}
								activeSaveID={this.props.activeSaveID}
								isReply={true}
								isPublished={this.props.isPublished}
								toggleMediaLibrary={this.props.toggleMediaLibrary}/>
						</div>

					}

					{/* Children */}
                {/*If Statement: if its a parent and showChilds is true or if it is not a parent*/}

            </div>
                    :<div>


        <div style={[styles.discussionActionsLine, styles.discussionActionsLineBottom]}>
                {(discussionItem.children.length === 0)
                ? <div style={[styles.detailLineItem, {display: 'inline-block'}]} onClick={this.collapseButtonClicked} >Show Discussion (0 Childs)</div>
                : <span style={[styles.detailLineItem, {display: 'inline-block'}]} onClick={this.collapseButtonClicked}>
                {(discussionItem.children.length) === 1
                    ?<div>Show Discussion ({discussionItem.children.length} child)</div>
                    :  <div>Show Discussion ({discussionItem.children.length} childs)</div>}
                   {/* {(authorReplied) ?'Author Replied' :''} */} </span>
                }
            </div>

                    </div>

		);
	},

    collapseButtonClicked: function(){

    console.log('toggle button was clicked');

        if(this.state.show == true){

            console.log('if condition was accessed as true');

           const newState = { show: false};
               this.setState(newState);
            console.log('current state is collapsed');
        }

        else{

           const newState = { show:true};
               this.setState(newState);
            console.log('current state is expanded');

        }

},

     childsButtonClicked: function(){

    console.log('childs toggle button was clicked');

        if(this.state.showChilds == true){

            console.log('if condition was accessed as true');

           const newState = { showChilds: false};
               this.setState(newState);
            console.log('current state of childs is collapsed');
        }

        else{

           const newState = { showChilds:true};
               this.setState(newState);
            console.log('current state of childs is expanded');

        }

     console.log('collapse button function was ran');

},


});

const ChildPubDiscussionItem = Radium(DiscussionsItem);
export default Radium(DiscussionsItem);

styles = {

    //this is the style of the discussion item container

	container: function(show, isChildCommentByThisPubAuthor) {
        return {
		width: '100%',
		// overflow: 'hidden',
		margin: '15px 0px 0px 0px',
		// backgroundColor: 'rgba(255,255,255,0.2)',
		clear: 'both',
        display: show==true ?'inline-block' :'none'
        }
	},
    readMore: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontWeight: 900,
        margin: 0,
        padding: '18px 0',
        backgroundImage: 'linear-gradient(to bottom, #F3F3F4, transparent 98%)',
},
	archived: {
		opacity: 0.7,
	},
	archivedContainer: {
		color: '#777',
		width: 'calc(100% - 20px)',
		// margin: '4px 0px',
		height: '17px',
		lineHeight: '17px',
		padding: '0px 10px',
		fontSize: '12px',
		// backgroundColor: 'rgba(255,255,255,0.2)',
		borderBottom: '1px solid #DDD',
		':hover': {
			color: '#444',
			cursor: 'pointer',
		},
	},
	authorName: function(isChildCommentByThisPubAuthor) {
        return{
		/* borderBottom: '1px solid #bbb', */
		fontWeight: 1000,
        color: isChildCommentByThisPubAuthor ?'red' :'black',
        }
	},
	hide: {
		display: 'none',
	},
	discussionHeader: {
		height: 36,
		width: '100%',
	},
	discussionAuthorImageWrapper: {
		height: 30,
		width: 30,
		padding: 3,
		float: 'left',
	},
	discussionAuthorImage: {
		width: '100%',
		height: '100%',
		borderRadius: '2px',
	},
	discussionDetailsLine: {
		height: 18,
		lineHeight: '16px',
		width: 'calc(100% - 36px - 36px - 5px)',
		paddingLeft: 5,
		color: '#333',
		fontSize: '13px',
		float: 'left',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	detailLineItem: {
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: '#000',
		}
	},
	detailLineItemSeparator: {
		padding: '0px 6px',
	},
	headerText: {
		color: '#555',
		fontFamily: 'Lora',
		':hover': {
			color: '#000',
			cursor: 'pointer',
		}
	},
	discussionDetailsLineBottom: {
		lineHeight: '18px',
		fontSize: '0.7em',
	},
	discussionBody: {
		width: '100%',
        height: '',
		position: 'relative',
		borderBottom: '1px solid #ddd',
        overflow: 'hidden',
		wordWrap: 'break-word',
	},
	discussionVoting: {
		width: '25px',
		height: '36px',
		float: 'left',
		fontSize: '12px',
		textAlign: 'center',
		padding: '3px 0px',
		fontFamily: 'Courier',
		// backgroundColor: 'rgba(255,0,100,0.2)',
	},
	discussionContent: {
		width: 'calc(100% -12px)',
		// marginLeft: 25,
		// overflow: 'hidden',
		color: '#222',
		// padding: '0px 15px',
		padding: '10px 6px 24px 6px', //padding between content and division line is 24px
		lineHeight: '1.58',
		fontSize: '1em',
		fontWeight: '300',
		fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
	},
	privateBlock: {
		textAlign: 'center',
		display: 'none',
		backgroundColor: '#444',
		color: 'white',
		borderRadius: '1px',
		padding: '0px 10px',
		fontSize: '0.8em',

	},
      discussionActionsLine: {
		height: 18,
		lineHeight: '16px',
		width: 'calc(100% - 36px - 36px - 5px)',
		paddingLeft: 5,
		color: '#333',
		fontSize: '13px',
		float: 'left',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
    discussionActionsLineBottom: {
		lineHeight: '18px',
		fontSize: '0.7em',
	},
	discussionChildrenWrapper: {
		width: 'calc(100% - 20px)',
		marginLeft: 20,
		// borderLeft: '1px solid #ccc',
		// borderTop: '1px solid #ccc',
	},
	dot: {
		fontSize: '0.50em',
		padding: '0px 3px',
		position: 'relative',
		top: '-2px',
		color: '#999',
	},
	date: {
		color: '#222',
		fontSize: '13px',
	},
	replyWrapper: {
		width: 'calc(100% - 20px)',
		marginLeft: 20,
		position: 'absolute',
		pointerEvents: 'none',
		opacity: 0,
	},
	replyWrapperActive: {
		position: 'relative',
		pointerEvents: 'auto',
		opacity: 1,
	}
};
