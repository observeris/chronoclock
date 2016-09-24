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

Only auto FTP deployment currently supported. If otherwise, manually copy the following:
```
assets/
engine/
external/
index.html
```

### FTP Deployment

```
$ gulp ftp-deploy
```

   * Script is set up to copy the deployment files into `/apps/countdown3d/` folder, relative to your FTP home folder.

   * Must have `.deploy_config.json` in your root folder in a form:
  ```
  {
    "host": <HOST>
    "user": <USER>
    "password": <PASSWORD>
  }

  ```
   * Unless you are hosting your own FTP, the config data needs to come from your host provider. E.g. for BLUEHOST, it's https://my.bluehost.com/web-hosting/cplogin?goto_uri=/frontend/bluehost/ftp/accounts.html

## Issues

ISSUE: HDR path is relative to site's root, so it'll look for `<SITE-ROOT>/engine/1affe44287d83e05a1a16cab72d997eb.hdr` instead of
`<APP-DIR>/engine/1affe44287d83e05a1a16cab72d997eb.hdr`: some copying may be required to work around it.
