# To Build and Run:

Run the following:
## Terminal 1:

```
$ python -m SimpleHTTPServer
```
## Terminal 2:

```
$ webpack --progress --colors --watch
```

## Browser
Go to `http://localhost:8000/`

For more information about running files locally, visit https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally

## Deployment

ISSUE: No current script for deployment yet. Manually copy the following:
```
assets/
engine/
external/
index.html
```
## Issues

ISSUE: HDR path is relative to site's root, so it'll look for `<SITE-ROOT>/engine/1affe44287d83e05a1a16cab72d997eb.hdr` instead of
`<APP-DIR>/engine/1affe44287d83e05a1a16cab72d997eb.hdr`: some copying may be required to work around it.
