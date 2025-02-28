# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

Link / repost posts:

-   [ ] https://medium.com/neo4j/how-we-build-a-clone-of-r-place-with-graphql-c8b053b3cff9
-   [ ] https://medium.com/neo4j/improving-a-node-js-graphql-server-performance-645a4ae711c3

New Posts:

-   [ ] Cypher builder https://medium.com/p/a8ee606c8ee4/
-   [ ] Minfck
-   [ ] My Guitar Tabs

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
