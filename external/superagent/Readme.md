Copied from https://github.com/visionmedia/superagent/tree/master/lib

To use the `request` object in a frontend, do: `import request from 'client';`

(Corresponding WebPack config should have the `client.js` path in it, e.g.:

```
  resolve: {
    root: [
      ...
      path.resolve('./external/superagent')
      ...
    ],
  }
```
