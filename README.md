# Anon Browser

Browse the p2p networks, create and view p2p websites<br>
[Matrix](https://matrix.to/#/#anon-browser:matrix.org)<br>
[Discord](https://discord.gg/8QzHpF8VZt)<br>

<p align="center" style="float: right">
	<img src="./build/icon.png" width="333px">
</p>

Anon is a p2p browser. it supports the following networks and protocols:

bittorrent<br>
ipfs<br>
hyper<br>
tor<br>
i2p<br>
lokinet<br>
ouinet<br>

It means you will be able to interact with p2p networks and view the p2p data on the browser. You will be able to create and upload p2p websites.

on a regular website, on the html file you would have

```
<html>
<head>
<title>
test
</title>
</head>

<div>
<p>test</p>
<img src="http://domain.com/some/file.jpeg"/>
</div>

</html>
```

With anon, you can do the same AND MORE like the following

```
<html>
<head>
<title>
test
</title>
</head>

<div>
<p>http example, regular http link</p>
<img src="http://domain.com/some/file.jpeg"/>

<p>bittorrent example, loading from p2p network using p2p link</p>
<img src="bt://infohashORpublickey/example.jpeg"/>
</div>

</html>
```

![Anon Animation](animation.gif)

This makes it possible to create fully peer to peer websites, no middlemen and no servers.

---
user configuration<br>
windows directory: C:\Users\username<br>
linux directory: /home/username<br>
file: .anonrc<br>
data: JSON object<br>

```
{
  "tor": {},
  "iip": {},
  "lok": {}
}
```
options for each protocol handler
```
// https://github.com/ducksandgoats/torrentz#options for bt options, along with the following
tor: {
	status: true, // boolean, enables or disables the handler, optional, default: true
	timeout: 0 // number, optional, default: 30000
},

iip: {
	status: true, // boolean, enables or disables the handler, optional, default: true
	timeout: 0 // number, optional, default: 30000
},

lok: {
	status: true, // boolean, enables or disables the handler, optional, default: true
	timeout: 0 // number, optional, default: 30000
}
```
---

This project was forked from [Agregore Browser](https://github.com/AgregoreWeb/agregore-browser).
Special thanks and shout out to [RangerMauve](https://github.com/RangerMauve), they are the creator and developer of Agregore.
