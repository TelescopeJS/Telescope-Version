var addJob = function () {
  SyncedCron.add({
    name: 'takeSnapshot',
    schedule: function(parser) {
      return parser.text('every day');
    }, 
    job: function() {
      takeSnapshot();
    }
  });
}

takeSnapshot = function () {
  var instancesCount = Instances.find().count();
  Snapshots.insert({
    date: new Date(),
    instancesCount: instancesCount
  });
}

Meteor.startup(function () {
  addJob();
});
