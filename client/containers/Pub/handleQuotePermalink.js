export default (pubData, quoteObject) => {
	const hasChapters = !!quoteObject.section;
	const chapterString = hasChapters ? `/content/${quoteObject.section}` : '';
	const toFromString = `?to=${quoteObject.to}&from=${quoteObject.from}`;
	const versionString = quoteObject.version ? `&version=${quoteObject.version}` : '';
	const permalinkPath = `/pub/${pubData.slug}${chapterString}${toFromString}${versionString}`;
	window.open(permalinkPath);
};
