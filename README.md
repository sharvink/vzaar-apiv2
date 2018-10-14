An unofficial node.js client for the vzaar API.

---

>vzaar is the go to video hosting platform for business. Affordable, customizable and secure. Leverage the power of online video and enable commerce with vzaar. For more details and signup please visit [http://vzaar.com](http://vzaar.com)

----

### Installation

    npm install 'vzaar-apiv2'


### Usage

```javascript

var Vzaar = require("vzaar-apiv2");
var vzaarAPI = new Vzaar( authToken,clientId);

```


### Endpoints:


##### Getting details from video:
```javascript
vzaarAPI.lookupVideo(videoId, callback);
```

##### Fetching videos:
```javascript
vzaarAPI.getVideos(callback);
```

Example:

```javascript
vzaarAPI.lookupVideo("17447571",function(err,res,body){
	console.log(err,body);
});;
```

##### Editing existing video:
```javascript
vzaarAPI.updateVideo(videoId,title,description,callback);
```



##### Deleting video from vzaar:
```javascript
vzaarAPI.deleteVideo(videoId, callback);
```
