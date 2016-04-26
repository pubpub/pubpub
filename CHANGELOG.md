# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

See [http://keepachangelog.com/](http://keepachangelog.com/) for best practices.

## [Planned]
- Import options for creating a pub. Import from PDF, .doc, etc
- Reference import tools. Import from endnote, mendeley, etc.
- Richer on-boarding tutorials for all aspects of the project
- Style Library that allows users to share and use Pub and Page styles.
- Clean exporting - xml, pdf, etc
- Tags for Pubs and Discussions
- Analytics
- Tools for filters, sorting comments
- Clear archive and backup instructions
- Make Discussions Editable - and history of edits visible

## [Unreleased]
### Added
- Landing page redesign.
- Font and padding improvements.
- Server-side PDF generation

## [0.2.0] - 2015-04-06
### Added
- Entire site is a sane single body page now. No more custom overflow: scroll divs.
- Editor header format updated.
- Editor updated with new menu. Formatting moved into menu, menu dropdowns added.
- Editor and discussion editor implement markdown widgets now. Collapsed and cleans markdown code for rich plugins.
- Pubs can now have saved versions that are not published. Allows commenting and default PubReader to be used on unpublished work.
- Discussions can now used assets, references, and highlights as richly as the Pub Editor can.
- Discussions and Editor comments combined. A single discussions thread exists per pub now. Discussions can be marked 'collaborator-only' for private comments. Are shown in line with public comments.
- Journals use pub Pages for their landing page.
- Assets are grouped by user, rather than by pub. This lets users use assets, references, etc across different pubs and in discussions.
- Assets support history, editing, and metadata.
- Pub styling much more powerful. All pub styles moved to css (out of radium in-line), so they can be customized by author.
- Custom language fields enabled on backend for journals. Allowing default language strings to be overwritten per-journal.


[Unreleased]: https://github.com/pubpub/pubpub/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/pubpub/pubpub/compare/v0.2.0...HEAD
