var request = require('requestretry');
const fs = require("fs"); //Load the filesystem module

var FormData = require('form-data');

const debugHttp = require('debug-http');
debugHttp();





function Vzaar(authToken,clientId){

      this.apiBase =  'https://api.vzaar.com/api/v2/' ,
      this.options = {
      //url: 'https://api.vzaar.com/api/v2/',
      headers: {
          'X-Auth-Token': authToken ,
          'X-Client-Id' : clientId
      },
      json: true,
      method: 'get',
      
            // The below parameters are specific to request-retry 
      maxAttempts: 100,   // (default) try 5 times 
      retryDelay: 1000,  // (default) wait for 5s before trying again 
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors 
  };


}

//account events

Vzaar.prototype.whoAmI = function(callback)
{
  this.options.method = 'get';
  this.options.url = this.apiBase + '/whoami' ;
  return request(this.options, callback);
}


//video API events

Vzaar.prototype.getVideos =  function(callback)
{

  this.options.method = 'get';
  this.options.url = this.apiBase + 'videos' ;
  return request(this.options, callback);

}
Vzaar.prototype.lookupVideo = function(videoId,callback)
{
  this.options.method = 'get';
  this.options.url = this.apiBase + 'videos/'+ videoId ;
  return request(this.options, callback);
}
Vzaar.prototype.updateVideo = function(videoId,title,description,callback)
{
  this.options.method = 'patch';
  this.options.body=    {
          'title' : title,
          'description' : description,
      };

  this.options.url = this.apiBase + 'videos/'+videoId;

  return request(this.options, callback);
}
Vzaar.prototype.deleteVideo = function(videoId,callback)
{
  this.options.method = 'delete';
  this.options.url = this.apiBase + 'videos/'+ videoId ;
  return request(this.options, callback);
}


//category API

Vzaar.prototype.getCategories =  function(callback)
{
  this.options.method = 'get';
  this.options.url = this.apiBase + 'categories' ;
  return request(this.options, callback);

}
Vzaar.prototype.lookupCategory = function(categoryId,callback)
{
  this.options.method = 'get';
  this.options.url = this.apiBase + 'categories/'+ categoryId ;
  return request(this.options, callback);
}
Vzaar.prototype.createCategory = function(categoryName,callback)
{
  this.options.method = 'post';
  this.options.body=    {
          'name' : categoryName
      };

  this.options.url = this.apiBase + 'categories';

  return request(this.options, callback);
}
Vzaar.prototype.updateCategory = function(categoryId,categoryName,parentId,callback)
{
  this.options.method = 'patch';
  this.options.body=    {
          'title' : categoryName,
          'parent_id' : parentId
      };

  this.options.url = this.apiBase + 'categories/'+categoryId;

  return request(this.options, callback);
}
Vzaar.prototype.deleteCategory = function(categoryId,callback)
{
  this.options.method = 'delete';
  this.options.url = this.apiBase + 'categories/'+ categoryId ;
  return request(this.options, callback);
}



Vzaar.prototype.getSignature =  function( filePath , type, callback)
{

    var path = require('path');

    var fileName = path.parse(filePath).base;

    console.log(fileName);

    const stats = fs.statSync(filePath);
    console.log(stats);
    const fileSizeInBytes = stats.size;
    console.log("File SIze" + fileSizeInBytes);

    this.options.headers["Content-Type"] = 'application/json';
    this.options.body = {
          'filename' : fileName , // Not required
          'filesize' : fileSizeInBytes, // Not required
          'uploader' : 'Ruby 2.3' //required
      },
    this.options.json= true,
    this.options.method= 'post'
  

  this.options.url = this.apiBase + 'signature/'+type ;

  console.log(this.options);
  return request(this.options, callback);

}

Vzaar.prototype.uploadVideo =  function(signature,type, callback) {

    var form = new FormData();
    form.append('x-amz-meta-uploader', 'Ruby 2.3');
    form.append('acl', signature.acl);
    form.append('bucket', signature.bucket);
    form.append('success_action_status', 201);
    form.append('policy', signature.policy);
    form.append('AWSAccessKeyId', signature.access_key_id);
    form.append('signature', signature.signature);
    form.append('key', signature.key);
    form.append('file', fs.createReadStream('videoplayback.mp4'));

    if(type=="multipart")
    {
      form.append('part_size', signature.part_size);
      form.append('part_size_in_bytes', signature.part_size_in_bytes);
      form.append('parts', signature.parts);
    }

    form.submit(signature.upload_hostname, function(err, res){
     // console.log(res);
      if (err) {
        console.log("upload failed");
        callback(res.statusCode, err);

      } else {
        if (res.statusCode === 201) {
          //callback(res.statusCode, { guid: signature.guid, key: signature.key },null);
          callback(res.statusCode, signature.guid);

          //this.createVideo(signature.guid)

        } else {
          res.on("data", function(data){
            callback(res.statusCode, data.toString(),null);
          });
        }
      }
    });
  }




Vzaar.prototype.generateUssToken = function(videoId , minutes = 1, callback){

    var md5 = require('md5');
    var moment = require('moment');

    var current_time = new Date ();

    current_time.setTime( current_time.getTime() + current_time.getTimezoneOffset()*60*1000 );


    //console.log(current_time);

    expiry_time = new Date ( current_time );
    expiry_time.setMinutes ( current_time.getMinutes() + minutes );
    //console.log(expiry_time);

    expiry_timestamp = moment(expiry_time).format("YYYYMMDDHHmmss");


    //console.log(expiry_timestamp);

    signing_key = "f7c1b1ecac024b08a27a01d7840e72d2";

    signature_vs = md5(videoId+':'+ signing_key+ ':' + expiry_timestamp);


    //console.log(signature_vs);

    token_vs = '2.'+expiry_timestamp+'.'+signature_vs;

    callback(token_vs);
    //console.log(token_vs);




}

Vzaar.prototype.createVideo =  function( guid, callback)
{

      this.options.body = {
          'guid' : guid ,
          'title' : "sharvin's Test video uploaded using API",
          'description' :'This is the video description'
      };
      this.options.json = true;
      this.options.method = 'post';
  

      this.options.url = this.apiBase + 'videos' ;

      console.log(this.options);

      request(this.options, callback);

}


Vzaar.prototype.setParams= function(Id,Token)
{

  this.options.headers= {
                            'X-Auth-Token': Id ,
                            'X-Client-Id' : Token
                        }
}



module.exports= Vzaar;




