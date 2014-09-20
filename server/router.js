Router.map(function() {
  this.route('out', {
    where: 'server',
    path: '/',
    action: function(){
      var data = this.request.query;
      console.log(data)
      this.response.setHeader('access-control-allow-origin', '*');
      this.response.setHeader('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept');
      this.response.write(latestVersion);
      this.response.end();

      // log request only if URL doesn't contain "localhost"
      if(data.siteUrl.indexOf('localhost') == -1 && data.siteUrl.indexOf('0.0.0.0') == -1){
        var upsert = Instances.upsert({siteUrl: data.siteUrl}, {
          $set: {
            siteUrl: data.siteUrl,
            currentVersion: data.currentVersion,
            siteTitle: data.siteTitle,
            users: data.users,
            posts: data.posts,
            comments: data.comments,
            lastSeenAt: new Date()
          }
        });
        // console.log(upsert)
      }
    }
  });
});