import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {MenuItem} from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import isUrl from 'is-url';

import {apiFetch} from 'client/utils/apiFetch';
import { useThrottled } from 'utils/hooks';

const propTypes = {};
const defaultProps = {};

const renderInputValue = () => "";

const isUrlLike = (string) => {
    if (string.startsWith("http://") || string.startsWith("https://")) {
        return true;
    }
    if (string.includes(" ")) {
        return false;
    }
    return 
}

const Component = (props) => {
    const [queryValue, setQueryValue] = useState("");
    const queryCountRef = useRef(-1);
    const [suggestableItems, setSuggestableItems] = useState([]);
    const throttledQueryValue = useThrottled(queryValue, 250, true, true);

    useEffect(() => {
        if (isUrl) {
            setSuggestableItems([]);
        } else {
            ++queryCountRef.current;
            const currentQuery = queryCountRef.current;

        }
    }, [throttledQueryValue])

    const renderItem = (item, {handleClick, modifiers}) => {
        return <MenuItem text="item"/>
    }

    return <Suggest
					items={suggestableItems}
					inputProps={{large: true}}
					inputValueRenderer={renderInputValue}
					onQueryChange={(query) => setQueryValue(query.trim)}
					itemRenderer={(item, { handleClick, modifiers }) => {
						return (
							<li key={item.id || 'empty-user-create'}>
								<button
									type="button"
									tabIndex={-1}
									onClick={handleClick}
									className={
										modifiers.active
											? 'bp3-menu-item bp3-active'
											: 'bp3-menu-item'
									}
								>
									{item.fullName && (
										<Avatar
											initials={item.initials}
											avatar={item.avatar}
											width={25}
										/>
									)}
									{item.name && <span>Add collaborator named: </span>}
									<span className="autocomplete-name">
										{item.name || item.fullName}
									</span>
								</button>
							</li>
						);
					}}
					resetOnSelect={true}
					onItemSelect={this.handleSelect}
					noResults={<MenuItem disabled text="No results" />}
					popoverProps={{
						popoverClassName: 'user-autocomplete-popover',
						minimal: true,
						position: Position.BOTTOM_LEFT,
						modifiers: {
							preventOverflow: { enabled: false },
							hide: { enabled: false },
						},
					}}
				/>
			</div>

};

Component.propTypes = propTypes;
Component.defaultProps = defaultProps;
export default Component;
