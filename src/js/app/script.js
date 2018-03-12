var Filtering = function(locations) {

    var self = this;

    self.items = ko.observableArray(locations);
    self.filter = ko.observable();

    self.filteredItems = ko.computed(function() {
        // console.log('markers' + markers)
        var filter = self.filter();
        if (!filter) {
            markers.forEach(function(marker) {
                marker.setMap(map)
                    // .setVisible(true);
            });
            return self.items();
        } else {
            return ko.utils.arrayFilter(self.items(), function(item) {
                var val = item.title;
                var matching = val.toLowerCase().indexOf(filter.toLowerCase()) + 1;
                // console.log("match" + matching)
                if (matching >= 1) {
                    // console.log('marker ' + markers[item.id].id);
                    markers[item.id].setMap(map)
                        // .setVisible(true)
                } else {
                    markers[item.id].setMap(null)
                        // .setVisible(false)
                }
                return matching;
            });
        }

    });
};