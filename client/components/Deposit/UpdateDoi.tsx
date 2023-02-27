import { Button, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { Resource } from 'deposit/resource';
import React, { useState } from 'react';
import { isDoi } from 'utils/crossref/parseDoi';

type Props = {
	editable: boolean;
	doiPrefix: string;
	doiSuffix: string;
	onUpdate(doiSuffix: string): void;
	onGenerate(): void;
	onDelete(): void;
	onSave(): void;
};

export function UpdateDoi(props: Props) {
	const fullDoi = `${props.doiPrefix}/${props.doiSuffix}`;

	let helperText = '';
	let intent: Intent = Intent.NONE;

	if (!isDoi(fullDoi)) {
		helperText = 'Invalid DOI suffix';
		intent = Intent.DANGER;
	}

	if (props.editable) {
		return (
			<FormGroup label="DOI Suffix" intent={intent} helperText={helperText}>
				<InputGroup
					placeholder="Enter a DOI suffix..."
					value={props.doiSuffix}
					onChange={(event) => props.onUpdate(event.target.value)}
					leftElement={<span className="doi-prefix">{props.doiPrefix}</span>}
				/>
				<Button text="Update Suffix" disabled={!props.doiSuffix} onClick={props.onSave} />
				<Button text="Generate Suffix" onClick={props.onGenerate} intent={Intent.SUCCESS} />
				<Button
					text="Delete"
					disabled={!props.doiSuffix}
					onClick={props.onDelete}
					intent={Intent.DANGER}
				/>
			</FormGroup>
		);
	}

	return (
		<>
			DOI:{' '}
			<a className="doi-link" href={`https://doi.org/${props.doiPrefix}/${props.doiSuffix}`}>
				{props.doiPrefix}/{props.doiSuffix}
			</a>
		</>
	);

	// if (this.isDoiEditable()) {
	//   return (
	//     <FormGroup
	//       helperText={helperText}
	//       // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type '"success"... Remove this comment to see the full error message
	//       intent={intent}
	//       className="doi"
	//       label="DOI Suffix"
	//     >
	//       <InputGroup
	//         placeholder="Enter a DOI suffix..."
	//         value={doiSuffix}
	//         onChange={(e) => this.setState({ doiSuffix: e.target.value })}
	//         leftElement={<span className="doi-prefix">{this.getDoiPrefix()}/</span>}
	//         style={{ zIndex: 0 }}
	//       />
	//       <Button
	//         disabled={!doiSuffix || invalidDoi || deleting || generating}
	//         text="Update Suffix"
	//         loading={updating}
	//         onClick={this.handleUpdateDoiClick}
	//         intent="success"
	//       />
	//       <Button
	//         disabled={invalidDoi || deleting || updating}
	//         text="Generate Suffix"
	//         loading={generating}
	//         onClick={this.handleGenerateDoiClick}
	//       />
	//       <Button
	//         disabled={!pubData.doi || invalidDoi || updating || generating}
	//         text="Delete"
	//         loading={deleting}
	//         onClick={this.handleDeleteDoiClick}
	//         intent="danger"
	//       />
	//     </FormGroup>
	//   );
	// }

	// return (
	//   <>
	//     {pubData.doi && (
	//       <p>
	//         Pub DOI:{' '}
	//         <a className="doi-link" href={`https://doi.org/${pubData.doi}`}>
	//           {pubData.doi}
	//         </a>
	//       </p>
	//     )}
	//   </>
	// );
}
