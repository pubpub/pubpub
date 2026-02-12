import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { usePageContext } from 'utils/hooks';

export type AltchaRef = {
	value: string | null;
	verify: () => Promise<string>;
};

type AltchaProps = {
	challengeurl?: string;
	auto?: 'off' | 'onfocus' | 'onload' | 'onsubmit';
	onStateChange?: (ev: Event | CustomEvent<{ payload?: string; state: string }>) => void;
	style?: React.CSSProperties & Record<string, string>;
};

const DEFAULT_CHALLENGE_URL = '/api/captcha/challenge';

type WidgetElement = HTMLElement & {
	verify: () => Promise<void>;
	reset: (state?: string, err?: Error) => void;
	addEventListener: HTMLElement['addEventListener'];
	removeEventListener: HTMLElement['removeEventListener'];
} & AltchaWidgetMethods;

const Altcha = forwardRef<AltchaRef, AltchaProps>((props, ref) => {
	const { challengeurl = DEFAULT_CHALLENGE_URL, auto, onStateChange, style } = props;
	const { locationData } = usePageContext();
	const devMode = false; //!locationData.isProd;
	const widgetRef = useRef<WidgetElement | null>(null);
	const [value, setValue] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);
	const [simulateFailure, setSimulateFailure] = useState(false);
	// force remount when mockerror changes
	const [widgetKey, setWidgetKey] = useState(0);
	const valueRef = useRef<string | null>(null);
	valueRef.current = value;

	useEffect(() => {
		import('altcha').then(() => setLoaded(true));
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: widgetKey triggers re-attach after remount
	useEffect(() => {
		if (!loaded) return;
		const w = widgetRef.current;
		if (!w) return;
		const handleStateChange = (ev: Event) => {
			const e = ev as CustomEvent<{ payload?: string; state: string }>;
			if (e.detail?.payload) setValue(e.detail.payload);
			onStateChange?.(e);
		};
		w.addEventListener('statechange', handleStateChange);
		return () => w.removeEventListener('statechange', handleStateChange);
	}, [loaded, onStateChange, widgetKey]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: widgetKey triggers re-bind after remount
	useImperativeHandle(
		ref,
		() => ({
			get value() {
				return valueRef.current;
			},
			verify(): Promise<string> {
				const w = widgetRef.current;
				if (!w) return Promise.reject(new Error('Altcha widget not mounted'));
				const current = valueRef.current;
				if (current) return Promise.resolve(current);
				return new Promise((resolve, reject) => {
					const handler = (ev: Event) => {
						const e = ev as CustomEvent<{ payload?: string; state: string }>;
						const state = e.detail?.state;
						if (state === 'verified' && e.detail?.payload) {
							w.removeEventListener('statechange', handler);
							resolve(e.detail.payload);
							return;
						}
						if (state === 'error' || state === 'expired') {
							w.removeEventListener('statechange', handler);
							w.show();
							reject(new Error('Captcha verification failed'));
						}
					};
					w.addEventListener('statechange', handler);
					w.verify();
				});
			},
		}),
		[widgetKey],
	);

	const handleToggleFailure = () => {
		setSimulateFailure((prev) => !prev);
		setValue(null);
		setWidgetKey((k) => k + 1);
	};

	const handleReset = () => {
		setValue(null);
		widgetRef.current?.reset();
	};

	if (!loaded) return null;

	const widget = (
		<React.Fragment key={widgetKey}>
			<altcha-widget
				ref={widgetRef as any}
				challengeurl={challengeurl}
				{...(auto ? { auto } : {})}
				{...(devMode ? { debug: true, floating: true } : { floating: true })}
				{...(simulateFailure ? { mockerror: true } : {})}
				style={style as any}
			/>
		</React.Fragment>
	);

	if (!devMode) return widget;

	return (
		<div
			style={{
				border: '2px dashed #5c7080',
				borderRadius: 4,
				padding: 8,
				margin: '8px 0',
				background: '#f5f8fa',
			}}
		>
			<div
				style={{
					fontSize: 11,
					fontWeight: 600,
					color: '#5c7080',
					marginBottom: 6,
				}}
			>
				Captcha (dev only)
			</div>
			{widget}
			<div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
				<label
					style={{
						fontSize: 11,
						color: simulateFailure ? '#db3737' : '#5c7080',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						gap: 4,
					}}
				>
					<input
						type="checkbox"
						checked={simulateFailure}
						onChange={handleToggleFailure}
					/>
					Simulate failure
				</label>
				<button
					type="button"
					onClick={handleReset}
					style={{
						fontSize: 11,
						padding: '2px 8px',
						cursor: 'pointer',
						border: '1px solid #ced9e0',
						borderRadius: 3,
						background: 'white',
					}}
				>
					Reset
				</button>
			</div>
		</div>
	);
});

Altcha.displayName = 'Altcha';

export default Altcha;
