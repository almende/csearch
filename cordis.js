var Converter = require('csvtojson').Converter;
var fs = require('fs');
var request = require('request');

// Remote Cordis projects URL.
// These are all linked from https://data.europa.eu/euodp/en/data/dataset?q=cordis&ext_boolean=all&sort=views_total+desc
var CORDIS_HORIZON2020_PROJECTS_URL = 'https://cordis.europa.eu/data/cordis-h2020projects.csv'
var CORDIS_HORIZON2020_ORGANIZATIONS_URL = 'https://cordis.europa.eu/data/cordis-h2020organizations.csv'

module.exports = {

  parseFile: function(file, cb) {
    var converter = new Converter({
      delimiter: ';',
      flatKeys: true,
    });

    converter.on('end_parsed', function (jsonArray) {
      cb(jsonArray);
    });

    fs.createReadStream(file).pipe(converter);

    return converter;
  },

  parseHorizon2020Projects: function(cb) {
    var converter = new Converter({
      delimiter: ';',
      // constructResult: false, // for big CSV data
      flatKeys: true,
    });

    converter.on("record_parsed", function(resultRow, rawRow, rowIndex) {
      process.stdout.write(".");
    });

    converter.on('end_parsed', function (jsonArray) {
      cb(jsonArray);
      console.log("projects done");
    });

    var options = {url:CORDIS_HORIZON2020_PROJECTS_URL,ecdhCurve:'secp384r1'};
    var results = request.get(options).on("error",(e)=>{console.log(e);});

    results.pipe(converter);

    return converter;
  },

  parseHorizon2020Organizations: function(cb) {
    var converter = new Converter({
      delimiter: ';',
      // constructResult: false, // for big CSV data
      flatKeys: true,
    });

    var result = {};

    converter.on('end_parsed', function (jsonArray) {
      cb(result);
      console.log("organizations done");
    });

    //record_parsed will be emitted each time a row has been parsed.
    converter.on("record_parsed", function(resultRow, rawRow, rowIndex) {
      var key = resultRow['projectRcn'];
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(resultRow);
      process.stdout.write(".");
    });

    //https://cordis.europa.eu/data/cordis-h2020organizations.csv
    var options = {url:CORDIS_HORIZON2020_ORGANIZATIONS_URL,ecdhCurve:'secp384r1'};
    var results = request.get(options).on("error",(e)=>{console.log(e);});
    results.pipe(converter);

    return converter;
  },

  parseHorizon2020: function(cb, options) {


    this.parseHorizon2020Organizations(function (orgs) {
      options = options || {};

      var converter = new Converter({
        delimiter: ';',
        // constructResult: false, // for big CSV data
        flatKeys: true,
      });

      converter.transform = function(json, row, index) {
        var rcn = json["rcn"];
        if (orgs[rcn]) {
          var flattenCoordinator = options['flattenCoordinator'] || false;
          if (flattenCoordinator) {

            for (var i=0; i<orgs[rcn].length; i++) {
              var org = orgs[rcn][i];

              if (org['role'] == 'coordinator' || org['role'] == 'hostInstitution') {
                json['coordinator_id'] = org['id'];
                json['coordinator_name'] = org['name'];
                json['coordinator_shortName'] = org['shortName'];
                json['coordinator_activityType'] = org['activityType'];
                json['coordinator_endOfParticipation'] = org['endOfParticipation'];
                json['coordinator_country'] = org['country'];
                json['coordinator_street'] = org['street'];
                json['coordinator_city'] = org['city'];
                json['coordinator_postCode'] = org['postCode'];
                json['coordinator_organizationUrl'] = org['organizationUrl'];
                break;
              }
            }
          }

          // Attach all organizations for reference
          json["organizations"] = orgs[rcn];
        }
      };

      converter.on('end_parsed', function (jsonArray) {
        cb(jsonArray);
        console.log("projects done");
      });

      var options = {url:CORDIS_HORIZON2020_PROJECTS_URL,ecdhCurve:'secp384r1'};
      var results = request.get(options).on("error",(e)=>{console.log(e);});

      results.pipe(converter);

      return converter;

    });
  }
}
