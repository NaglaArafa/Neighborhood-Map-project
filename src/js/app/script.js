var data = [{
    Id: 1,
    LastName: "Franklin"
}, {
    Id: 2,
    LastName: "Green"
}, {
    Id: 3,
    LastName: "Balmer"
}];

var columns = [{
    value: 'Id'
}, {
    value: 'LastName'
}];

var Filtering = function (data, columns) {
    var self = this;

    self.items = ko.observableArray(data);
    self.columns = ko.observableArray(columns);
    self.filter = ko.observable();

    self.filteredItems = ko.computed(function () {
        var filter = self.filter();
        console.log(filter);
        if (!filter) {
            return self.items();
        } else {
            return ko.utils.arrayFilter(self.items(), function (item) {
                console.log('Filtering on Item');
                var matching = -1;
                ko.utils.arrayForEach(self.columns(), function (c) {
                    var val = item[c.value];
                    if (typeof val === 'number') {
                        val = val.toString();
                    }
                    console.log('Filtering on Column');
                    matching+= val.toLowerCase().indexOf(filter.toLowerCase())+1;
                });
                 console.log(matching);
                return matching>=0;
            });
        }

    });
};

ko.applyBindings(new Filtering(data, columns));