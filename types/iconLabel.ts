import React from 'react';
import { IconName } from 'client/components';
import { Intent as BlueprintIntent } from '@blueprintjs/core';

export type IconLabelPair = {
	icon: IconName;
	label: string | React.ReactNode;
	iconSize?: number;
	intent?: BlueprintIntent;
};
