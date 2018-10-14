An unofficial node.js client for the vzaar API.

---

>vzaar is the go to video hosting platform for business. Affordable, customizable and secure. Leverage the power of online video and enable commerce with vzaar. For more details and signup please visit [http://vzaar.com](http://vzaar.com)

----

### Installation

    npm install 'vzaar-api-v2'


### Usage

```javascript

var Vzaar = require("vzaar-api-v2");
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
});
```


##### Editing existing video:
```javascript
vzaarAPI.updateVideo(videoId,title,description,callback);
```



##### Deleting video from vzaar:
```javascript
vzaarAPI.deleteVideo(videoId, callback);
```

#### Uploading Video:
##### Generating Signature:

```javascript
const filePath = "videoplayback.mp4";
vzaarAPI.getSignature(filePath,"multipart",function(err,res,body){

	var path = require('path');

	var fileName = path.parse(filePath).base;

	body.data.key = body.data.key.replace( "${filename}", fileName+".0" );
	
	console.log(body.data);// this is the signature	
	
	

})
```
##### Uploading Video

```javascript
vzaarAPI.uploadVideo(body.data,"multipart",function(statusCode,guid){

	console.log(statusCode);
	console.log(guid);
		
});
```

##### Create Video
```javscript
vzaarAPI.createVideo(guid, "Sample Title", "Sample Description" , function(err,res,body){
				
	console.log(err,body);
			
})
```
Example:

