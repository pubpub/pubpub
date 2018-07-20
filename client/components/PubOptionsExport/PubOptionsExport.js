import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { apiFetch } from 'utilities';

require('./pubOptionsExport.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	// loginData: PropTypes.object.isRequired,
	// setPubData: PropTypes.func.isRequired,
	// TODO: we should pass in content in the case that we are in the working draft
	// or maybe just a reference to the function to get draft content.
};

class PubOptionsExport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			type: { format: 'pdf', title: 'PDF' },
			taskId: undefined,
		};
		this.handleExport = this.handleExport.bind(this);
		this.checkTask = this.checkTask.bind(this);
	}

	handleExport() {
		// Check if that format is available for download, if not send off event.
		this.setState({ isLoading: true });
		return apiFetch('/api/export', {
			method: 'POST',
			body: JSON.stringify({
				pubId: this.props.pubData.id,
				versionId: this.props.pubData.isDraft
					? 'draft'
					: this.props.pubData.activeVersion.id,
				content: '',
				format: this.state.type.format,
			})
		})
		.then((taskId)=> {
			this.setState({ taskId: taskId });
			setTimeout(()=> {
				this.checkTask();
			}, 1500);
		})
		.catch(()=> {
			this.setState({ isLoading: false });
		});
	}

	checkTask() {
		return apiFetch(`/api/workerTasks?workerTaskId=${this.state.taskId}`)
		.then((taskData)=> {
			if (taskData.isProcessing) {
				setTimeout(()=> {
					this.checkTask();
				}, 1500);
			} else {
				this.setState({
					isLoading: false,
					taskId: undefined,
				});
				window.open(taskData.output.url);
			}
		})
		.catch(()=> {
			this.setState({ isLoading: false });
		});
	}

	render() {
		const types = [
			{ format: 'pdf', title: 'PDF' },
			{ format: 'docx', title: 'Word' },
			{ format: 'markdown', title: 'Markdown' },
		];
		return (
			<div className="pub-options-delete-component">
				<h1>Export Pub</h1>

				<p>Export the current version or working draft.</p>
				<div className="pt-button-group">
					{types.map((type)=> {
						return (
							<button
								key={type.format}
								className={`pt-button ${this.state.type.format === type.format ? 'pt-active' : ''}`}
								onClick={()=> {
									this.setState({ type: type });
								}}
								type="button"
							>
								{type.title}
							</button>
						);
					})}
				</div>

				<div>
					<Button
						type="button"
						className="pt-intent-primary pt-large"
						text={`Export ${this.state.type.title} File`}
						loading={this.state.isLoading}
						onClick={this.handleExport}
					/>
				</div>
			</div>
		);
	}
}

PubOptionsExport.propTypes = propTypes;
export default PubOptionsExport;
