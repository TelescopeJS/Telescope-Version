Router.map(function() {
  this.route('out', {
    where: 'server',
    path: '/',
    action: function(){
      var data = this.request.query;
      // console.log(data)
      this.response.setHeader('access-control-allow-origin', '*');
      this.response.setHeader('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept');
      this.response.write(latestVersion);
      this.response.end();

      // log request
      var upsert = Instances.upsert({siteUrl: data.siteUrl}, {
        $set: {
          siteUrl: data.siteUrl,
          currentVersion: data.currentVersion,
          siteTitle: data.siteTitle
        }
      });
      // console.log(upsert)
    }
  });
});