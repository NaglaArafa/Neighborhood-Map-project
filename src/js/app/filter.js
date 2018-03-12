var FilterList = function(locations) {

    var that = this;
    //array that hold the loactions
    that.items = ko.observableArray(locations);
    //variable that hold the value which wrritten in the textbox
    that.filter = ko.observable();

    that.filteredItems = ko.computed(function() {
        var filter = that.filter();
        //if there is no filter then it will show the whole list and all markers
        if (!filter) {
            markers.forEach(function(marker) {
                marker.setMap(map)
            });
            return that.items();
        //if there is some characters in the textbox then it will filter by it
        // and show only the matched items
        } else {
            return ko.utils.arrayFilter(that.items(), function(location) {
                var title = location.title;
                var match = title.toLowerCase().indexOf(filter.toLowerCase()) + 1;
                if (match >= 1) {
                    markers[location.id].setMap(map)
                } else {
                    markers[location.id].setMap(null)
                }
                return match;
            });
        }

    });
};