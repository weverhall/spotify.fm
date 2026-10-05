## Work Log

| date | hours | work  |
| :----:|:-----| :-----|
| 2025   |      | |
| 28.11. | 9    | researched suitable topics, refined implementation ideas |
| 1.12.  | 6    | ran create-next-app, expanded the app skeleton, updated dependencies, customized linting |
| 2.12.  | 5    | acquired spotify web api secrets, added client credentials token fetching |
|        | 3    | implemented zod schemas |
| 3.12.  | 5    | started coding vercel kv after checking out free hosting options that would offer redis-style cache and mongodb support |
| 4.12.  | 8    | continued working towards online spotify user login using auth token fetch and session cookie, improved project structure and typing |
| 5.12.  | 3    | switched from vercel to render hosting and changed session related code accordingly |
|        | 1    | confirmed that the cookie and the token do indeed go into the db, updated dependencies to patch react2shell vulnerability |
| 6.12.  | 2    | made sure to not return user's full auth token object to the client, added token ttl fetch from redis |
|        | 5    | began to use the refresh token of my own credentials to fetch the actual global playlist contents |
|        | 1    | centralized env variables and redis client creation to shared utils files |
| 7.12.  | 3    | spent hours investigating why spotify api returns 404 for all algorithmic and curated playlists, and apparently about a year ago they removed that functionality of the playlist endpoint for new api users, so currently my plan is to pivot to using some other api for global trends data |
| 10.12. | 5    | started implementing user-specific spotify api logic and stopped trying to fetch playlist data from a partly-deprecated endpoint with a separate non-expiring refresh token |
| 12.12. | 4    | began using docker containers and localhost.run oauth callback tunneling for local dev, created a production dockerfile for render as well |
|        | 2    | optimized dockerfiles, switched to lazy-loading of redis client, created a redirect from callback route, changed a few secrets on render to apply at build time |
| 13.12. | 2    | implemented oauth state handling for pre-auth csrf protection |
|        | 4    | added top trending tracks fetching from last.fm api, cleaned up schemas and project structure |
| 2026   |      | |
| 14.2.  | 5    | tried figuring out how to best implement unit and integration tests for async server-side react as e.g. jest and vitest don't fully support this |
| 15.2.  | 3    | set up playwright to get some basic e2e tests running and made a simple github actions workflow for them |
| 17.2.  | 7    | created a daily cron job that triggers a script which retrieves trending tracks from last.fm's api and stores the json into redis  |
| 18.2.  | 6    | fixed cron's script and track fetching methods, struggled to get redis connection and env values working with ci, render deployment, and local container setups |
| 19.2.  | 5    | homepage trending tracks data is now inside a scrollable primereact table with search, also added all-time playcount and daily trending rank that persists when using search |
| 20.2.  | 4    | installed vitest and incorporated mock api unit tests into the ci pipeline |
| 23.2.  | 7    | used msw to write integration tests for the api calls, greatly improved unit testing and mocks as well  |
| 26.2.  | 4    | enabled isr for homepage and made a cron script to trigger revalidation after redis data update |
| 2.3.   | 1    | combined cache cron job with a preceding cold start of the render site, changed ci to use specific ubuntu runner version, added dependabot |
| 4.3.   | 2    | improved unit tests, added a second get request to the revalidation script to ensure warm cache |
| 8.3.   | 2    | got isr finally fully working by initially polling homepage and ensuring redis disconnect after storing data |
| 26.9.  | 4    | improved tests by removing useless assertions, unstubbing properly, and using a real fixture for last.fm tracks data, also updated repo and page naming |
| 27.9.  | 8    | connected to mongodb atlas via mongoose and implemented a preliminary version of trending tracks rank history, also updated env validation and ci |
| 28.9.  | 4    | redesigned homepage UI: new spotify login button, data table now with sorting and improved looks, elements resized and aligned, e2e tests updated accordingly |
| 29.9.  | 10   | created the first draft of a proper user stats page, added logo and filtering to trending tracks table, started storing trending tracks to mongodb only, improved cron and storing logic |
| 30.9.  | 5    | polished user stats page UI and UX, also modified env in render, github, and api dashboard in order to change app url to reflect new spotify.fm name |
| 1.10.  | 7    | continued with improving user tracks page UI and UX, tidied up file structure and naming |
| 2.10.  | 5    | moved user top tracks fetching server-side and extended it to all three time ranges instead of just medium term, adjusted schema and jsx so that album covers are shown |
| 3.10.  | 4    | started fetching user profiles, moved session handling fully server-side, combined multiple trending tracks chart snapshot queries into one to reduce mongodb round trips |
| 4.10.  | 6    | implemented server-side reads and server action writes for user favorite tracks |
| 5.10.  | 6    | added security headers and csp, protected favorites against misuse with rate limiting and payload caps |
| total  | 173  |  |
