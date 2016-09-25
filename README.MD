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

### Wordpress integration

1. Pick a current theme.
2. Clone theme's index.php, add this on top:
```
<?php
/*
Template Name: Showcase3D
*/
?>
```
3. In the <div id="content" class="blog" > </div>, empty everything.
4. In the <div id="content" class="blog" >, add the following:

```
		<div id="container"></div>
		<div id="info">
		<a href="http://threejs.org" target="_blank">three.js</a> Countdown by <a href="https://twitter.com/Nikolai3D">Nikolai3D</a>
        </div>             
   		<script src="<?php bloginfo('stylesheet_directory'); ?>/3dshowcase/external/three/examples/js/Detector.js"></script>
			<script src="<?php bloginfo('stylesheet_directory'); ?>/3dshowcase/external/three/examples/js/libs/stats.min.js"></script>
	    <script src="<?php bloginfo('stylesheet_directory'); ?>/3dshowcase/engine/main.js"></script>
```
5. Copy app files into theme folder + `/3dshowcase`;

