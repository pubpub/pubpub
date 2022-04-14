import { useLayout } from 'client/components/LayoutEditor/useLayout';
import { useEffect, useLayoutEffect, useRef } from 'react';
import stickybits, { StickyBits } from 'stickybits';

type Callback = () => unknown;

type Options = {
	offset?: number;
	isActive?: boolean;
	target: string | HTMLElement;
};

const useOrFakeResizeObserver = (onResize: Callback) => {
	const lastBodyHeight = useRef<null | number>(null);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			if ('ResizeObserver' in window) {
				const observer = new (window as any).ResizeObserver(onResize);
				observer.observe(document.body);
				return () => observer.disconnect();
			}
			const interval = setInterval(() => {
				const bodyHeight = document.body.offsetHeight;
				if (bodyHeight !== lastBodyHeight.current) {
					lastBodyHeight.current = bodyHeight;
					onResize();
				}
			}, 100);
			return () => clearInterval(interval);
		}
		return () => {};
	}, [onResize]);
};

export const useSticky = (options: Options) => {
	const { target, offset = 0, isActive = true } = options;
	const stickyInstanceRef = useRef<null | StickyBits>(null);

	useEffect(() => {
		if (isActive) {
			stickyInstanceRef.current = stickybits(target, {
				stickyBitStickyOffset: offset,
				useStickyClasses: true,
			});
			return () => {
				try {
					stickyInstanceRef.current!.cleanup();
				} catch (e) {
					// Whatever
				}
			};
		}
		return () => {};
	}, [isActive, offset, target]);

	// Update the stickybits instance each time the parent component updates.
	useLayoutEffect(() => stickyInstanceRef.current?.update());
	// Update the stickybits instance when the body height changes, which could
	// affect the y-offset of the sticky element.
	useOrFakeResizeObserver(() => stickyInstanceRef.current?.update());
};

export const isSticky = (element: HTMLElement) => {
	return element.classList.contains('js-is-sticky');
};
