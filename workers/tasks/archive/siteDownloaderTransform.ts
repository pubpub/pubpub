import { PassThrough, Readable, Transform, TransformOptions } from 'node:stream';
import { RewritingStream } from 'parse5-html-rewriting-stream';

import type * as streamWeb from 'node:stream/web';

// https://stackoverflow.com/questions/76958222/how-to-pipe-response-from-nodejs-fetch-response-to-an-express-response#comment139165202_77589444
declare global {
	interface Response {
		readonly body: streamWeb.ReadableStream<Uint8Array> | null;
	}
}

export type SiteDownloaderTransformConfig = TransformOptions & {
	assetDir?: string;
	assetUrlFilter?: (url: string) => boolean;
	headers?: Record<string, string>;
};

const isLinkTag = (tag: any) => tag.tagName === 'link';

const isStylesheetTag = (tag: any) =>
	tag.tagName === 'link' &&
	tag.attrs.some((attr: any) => attr.name === 'rel' && attr.value === 'stylesheet');

const transformAnchorTag = (tag: any, pageUrl: URL) => {
	const href = tag.attrs.find((attr: any) => attr.name === 'href');
	if (href?.value === undefined) {
		return;
	}
	if (href.value.startsWith(pageUrl.href)) {
		href.value = href.value.replace(pageUrl.href, '/');
	}
};

const transformAssetTag = (tag: any, pageUrl: URL, config: SiteDownloaderTransformConfig) => {
	if (isLinkTag(tag) && !isStylesheetTag(tag)) {
		return;
	}
	const assetSrc = tag.attrs.find((attr: any) => attr.name === 'src' || attr.name === 'href');
	if (assetSrc === undefined) {
		return;
	}
	const assetUrl = new URL(assetSrc.value, pageUrl);
	if (config.assetUrlFilter?.(assetUrl.href) === false) {
		return;
	}
	const assetDir = `/${config.assetDir}/${assetUrl.hostname.replace(/\./g, '_')}`;
	const assetPath = `${assetDir}${assetUrl.pathname}`;
	tag.attrs = tag.attrs.map((attr: any) =>
		attr.name === assetSrc.name ? { ...attr, value: assetPath } : attr,
	);
	return { assetUrl, assetPath };
};

const defaultConfig: SiteDownloaderTransformConfig = {
	assetDir: 'assets',
	assetUrlFilter: (url: string) => true,
	headers: {},
};

export class SiteDownloaderTransform extends Transform {
	static #assetUrls = new Set<string>();
	static hasAssetUrl(url: string | URL) {
		return this.#assetUrls.has(url.toString());
	}

	#config: SiteDownloaderTransformConfig;

	constructor(config?: Partial<SiteDownloaderTransformConfig>) {
		const finalConfig = { ...defaultConfig, ...config };
		super({ ...finalConfig, objectMode: true });
		this.#config = finalConfig;
	}

	async #fetch(url: string | URL) {
		return fetch(url, {
			headers: this.#config.headers,
		});
	}

	#pushAsset(assetUrl: URL, assetPath: string) {
		if (SiteDownloaderTransform.hasAssetUrl(assetUrl.href)) {
			return;
		}

		const stream = new PassThrough();

		this.push({ name: assetPath, stream });

		this.#fetch(assetUrl)
			.then((response) => {
				Readable.fromWeb(response.body!).pipe(stream);
			})
			.catch((err) => {
				console.error(`Failed to fetch asset ${assetUrl.href}:`, err);
				// If the asset fetch fails, we still want to push an empty stream
				// so that the archive can be created without errors.
				stream.destroy();
			});

		SiteDownloaderTransform.#assetUrls.add(assetUrl.href);
	}

	transformTag(tag: any, pageUrl: URL) {
		switch (tag.tagName) {
			case 'a': {
				transformAnchorTag(tag, pageUrl);
				break;
			}
			case 'img':
			case 'script':
			case 'link': {
				const result = transformAssetTag(tag, pageUrl, this.#config);
				if (result === undefined) {
					break;
				}
				this.#pushAsset(result.assetUrl, result.assetPath);
				break;
			}
		}
	}

	async _transform(url: string, _: BufferEncoding, callback: (error?: Error | null) => void) {
		try {
			// need to get primary urls running at / instead of /blah_blah_org
			const pageUrl = new URL(url);
			const pagePath =
				pageUrl.pathname + (pageUrl.pathname.endsWith('/') ? '' : '/') + 'index.html';

			console.log('Fetching page:', url.toString());

			const response = await this.#fetch(url);

			if (!response.ok) {
				throw new Error(`Failed to fetch ${url}: ${response.status}`);
			}

			const htmlRewriter = new RewritingStream();

			htmlRewriter.on('startTag', (tag) => {
				this.transformTag(tag, pageUrl);
				htmlRewriter.emitStartTag(tag);
			});

			const htmlStreamDecoder = new TextDecoder('utf8');
			const htmlStream = Readable.fromWeb(response.body!)
				.map((chunk: Uint8Array) => htmlStreamDecoder.decode(chunk, { stream: true }))
				.pipe(htmlRewriter);

			this.push({ name: pagePath, stream: htmlStream });

			htmlStream.on('end', async () => {
				try {
					callback();
				} catch (err) {
					callback(err as Error);
				}
			});

			htmlStream.on('error', callback);
		} catch (err) {
			callback(err as Error);
		}
	}
}

export const createSiteDownloaderTransform = (config?: Partial<SiteDownloaderTransformConfig>) => {
	return new SiteDownloaderTransform(config);
};
