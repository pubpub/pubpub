import { SuggestCallbackParams } from 'prosemirror-suggest';

const modFloor = (a: number, n: number) => ((a % n) + n) % n;

export enum SuggestionManagerStatus {
	Closed,
	Suggesting,
}

type SuggestionManagerStateClosed = Readonly<{
	status: SuggestionManagerStatus.Closed;
}>;

type SuggestionManagerStateSuggesting<T> = Readonly<{
	status: SuggestionManagerStatus.Suggesting;
	index: number;
	items: ReadonlyArray<T>;
	params: SuggestCallbackParams;
}>;

type SuggestionManagerState<T> = SuggestionManagerStateClosed | SuggestionManagerStateSuggesting<T>;

export type SuggestionManagerSuggesting<T> = SuggestionManager<T> & {
	state: SuggestionManagerStateSuggesting<T>;
};

export default class SuggestionManager<T> {
	static getSuggestionDropdownPosition({
		state: { params },
	}: SuggestionManagerSuggesting<unknown>) {
		const bounds = params.view.coordsAtPos(params.range.from + 1);
		const parent = document.body.getBoundingClientRect();

		return {
			top: bounds.bottom - parent.top,
			left: bounds.left - parent.left,
		};
	}

	static getSelectedValue<T>({ state: { items, index } }: SuggestionManagerSuggesting<T>) {
		return items[modFloor(index, items.length)];
	}

	private _state: SuggestionManagerState<T> = { status: SuggestionManagerStatus.Closed };

	get state() {
		return this._state;
	}

	load(items: T[], params: SuggestCallbackParams) {
		this._state = {
			status: SuggestionManagerStatus.Suggesting,
			index: this.isSuggesting() ? this.state.index : 0,
			items: items,
			params: params,
		};
	}

	next() {
		if (!this.isSuggesting()) {
			return;
		}

		const { state } = this;

		this._state = {
			...state,
			index: state.index + 1,
		};
	}

	previous() {
		if (!this.isSuggesting()) {
			return;
		}

		const { state } = this;

		this._state = {
			...state,
			index: state.index - 1,
		};
	}

	select(item?: T) {
		if (!this.isSuggesting()) {
			return;
		}

		const {
			items,
			params: { command },
		} = this.state;

		command(
			item !== undefined && items.includes(item)
				? item
				: SuggestionManager.getSelectedValue(this),
		);

		this.close();
	}

	close() {
		this._state = {
			status: SuggestionManagerStatus.Closed,
		};
	}

	isSuggesting(): this is SuggestionManagerSuggesting<T> {
		return this.state.status === SuggestionManagerStatus.Suggesting;
	}
}
