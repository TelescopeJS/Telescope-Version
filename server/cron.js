var addJob = function () {
  SyncedCron.add({
    name: 'takeSnapshot',
    schedule: function(parser) {
      return parser.recur().on('09:00:00').time();
    }, 
    job: function() {
      takeSnapshot();
    }
  });
}

takeSnapshot = function () {

  var snapshot = {};

  // instances count
  snapshot.instancesCount = Instances.find().count();

  // active instances count (seen in last month);
  var oneMonthAgo = moment().subtract(1, 'months').toDate();
  snapshot.activeCount = Instances.find({lastSeenAt: {$gte: oneMonthAgo}}).count();

  // stars count
  var gitHubUrl = 'https://api.github.com/repos/telescopejs/telescope';
  var repo = HTTP.get(gitHubUrl, {
    headers: {
      "User-Agent": "Telescopejs"
    }
  }).data;
  snapshot.starsCount = parseInt(repo.stargazers_count);
  snapshot.forksCount = parseInt(repo.forks_count);

  // visitors count
  var clickyUrl = 'http://api.clicky.com/api/stats/4?site_id=100538336&sitekey=e9ab6e3c1f515806&type=visitors&output=json&date=yesterday';
  snapshot.visitorsCount = parseInt(HTTP.get(clickyUrl).data[0].dates[0].items[0].value);

  snapshot.date = new Date();

  console.log('// inserting snapshot…')
  console.log(snapshot)

  Snapshots.insert(snapshot);
}

Meteor.startup(function () {
  addJob();
  SyncedCron.start();
});

Meteor.methods({
  takeSnapshot: function () {
    takeSnapshot();
  }
});