# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

See [http://keepachangelog.com/](http://keepachangelog.com/) for best practices.

## [Planned]
- Import options for creating a pub. Import from PDF, .doc, etc
- Reference import tools. Import from endnote, mendeley, etc.
- Style Library that allows users to share and use Pub and Page styles.
- JATS XML export
- Tags for Pubs and Discussions
- Tools for filters, sorting comments
- Clear archive and backup instructions

## [Unreleased]
### Added


## [v2.1.0] - 2015-08-04
- Following functionality and lists
- Bug fixes for handling bad version requests when reading Pubs
- Bug fixes for Login error message and empty password submission

## [v2.0.0] - 2015-08-03
### Added
- Major overhaul of entire platform architecture and UI
- Landing page redesign. Making way for a more feed-based view.
- Atom structure introduced to create more general publishing, sharing, commenting toolset.
- Editor updated to support WSIWYG editing. Falls back to markdown, markdown can convert up to WSYWIG.
- Journals more from subdomains, to routes with dedicated profile. 
    - Journal landing pages deprecated. 
    - Journal info updated to include website, twitter account, facebook account
- Pub View mode updated to have simple 2-column view, analytics, new rendering engine. 
- Pubs have added data fields to allow preview image, description, custom author string.
- User profiles updated to allow new data fields such as website, twitter account, ORCID, github account.
- Discussions are pubs! They can be edited, versioned, given permalinks, cited, etc.
- Support for Jupyter notebooks as an atom type.
- Migrating Latex math support to KaTeX.
- Server-side PDF generation, Markdown file generation.
- Cleaner test architecture and scaffolding.
- Email verification required to create pubs, journals, etc.

## [v1.1.0] - 2015-07-21
### Added 
- Bug fixes for Journal sorting
- Adding Captcha to reduce spam
- Scaffolding for Guide created


## [v1.0.0] - 2015-04-06
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


[Unreleased]: https://github.com/pubpub/pubpub/compare/v2.1.0...HEAD
[v2.1.0]: https://github.com/pubpub/pubpub/compare/v2.0.0...v2.1.0
[v2.0.0]: https://github.com/pubpub/pubpub/compare/v1.1.0...v2.0.0
[v1.1.0]: https://github.com/pubpub/pubpub/compare/v0.2.0...v1.1.0
[v1.0.0]: https://github.com/pubpub/pubpub/commit/12136801c7f5f5dc8225077653ed713f348f2673
