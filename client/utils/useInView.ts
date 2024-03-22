import { RefObject, useEffect, useState } from 'react';

export interface UseInViewOptions extends Omit<InViewOptions, 'root' | 'amount'> {
	root?: RefObject<Element>;
	once?: boolean;
	amount?: 'some' | 'all' | number;
}

export type ViewChangeHandler = (entry: IntersectionObserverEntry) => void;

export interface InViewOptions {
	root?: Element | Document;
	margin?: string;
	amount?: 'some' | 'all' | number;
}

const thresholds = {
	some: 0,
	all: 1,
};

export function inView(
	element: Element,
	onStart: (entry: IntersectionObserverEntry) => void | ViewChangeHandler,
	{ root, margin: rootMargin, amount = 'some' }: InViewOptions = {},
): () => void {
	const activeIntersections = new WeakMap<Element, ViewChangeHandler>();

	const onIntersectionChange: IntersectionObserverCallback = (entries, observer) => {
		entries.forEach((entry) => {
			const onEnd = activeIntersections.get(entry.target);

			/** If there's no change to the intersection, we don't need to do anything here. */
			if (entry.isIntersecting === Boolean(onEnd)) return;

			if (entry.isIntersecting) {
				const newOnEnd = onStart(entry);
				if (typeof newOnEnd === 'function') {
					activeIntersections.set(entry.target, newOnEnd);
				} else {
					observer.unobserve(entry.target);
				}
			} else if (onEnd) {
				onEnd(entry);
				activeIntersections.delete(entry.target);
			}
		});
	};

	const observer = new IntersectionObserver(onIntersectionChange, {
		root,
		rootMargin,
		threshold: typeof amount === 'number' ? amount : thresholds[amount],
	});

	// element.forEach((element) => observer.observe(element));
	observer.observe(element);

	return () => observer.disconnect();
}

export function useInView(
	ref: RefObject<Element>,
	{ root, margin, amount, once = false }: UseInViewOptions = {},
) {
	const [isInView, setInView] = useState(false);

	useEffect(() => {
		if (!ref.current || (once && isInView)) return;

		const onEnter = () => {
			setInView(true);

			return once ? undefined : () => setInView(false);
		};

		const options: InViewOptions = {
			root: (root && root.current) || undefined,
			margin,
			amount,
		};

		return inView(ref.current, onEnter, options);
	}, [root, ref, margin, once, amount]);

	return isInView;
}
