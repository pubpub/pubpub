# Introduction

This API is a test for SSR React 

# Running Locally

```
npm install
npm start
```

# SSR Architecture

- Don't render SPA. Render individual pages
	- Dealing with routing causes painful scroll issues. Don't reinvent the wheel
	- Makes server-side analytics trickier - forcing non-free analytics platforms (e.g. Google)
	- So much overhead goes into downloading the whole application (even when on serviceworker).
	- Designing loading-states is a slow-delopers's excuse. Don't worry about immediate transitions - just worry about fast page loads.
	- Allows for data calls to be generated at once while on the server. Only one round-trip, rather than 1) load app, 2) finish first API call for site data, 3) finish second api call for content.
	- SEO. Prerendering remains painful. (Not to mention archive.org archiving).
	- Redux and connect actually make storybook more tricky. Without them, rendering pages in storybook is simple and powerful. Use storybook for hot-reloading, Full site nav for integration testing.
	- The idea that a static site reduces load is a fallacy. You still need an API to serve every site load. An rather than one call, you're making multiple. Sure - if your API is loaded, you can show users something - but they don't want something - they want the content. And if your API is loaded, it's loaded.




- Bundling Routes
	- Need to manually specify all containers in webpack configs.

- What is worse?
	- Service workers have been removed. Again - service workers let me show the app right away (and if offline conditions) - but they still rely on the API call, which does have an offline fallback - but may still be slow. 
	- full-site hot module reload is not implemented, and seem to be a trickier beast. 

