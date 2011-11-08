var pg = require('pg');

module.exports = {
    retrieve: function (bounds, callback) {

        var connString = 'tcp://spatial:spatial@localhost/spatial';

        pg.connect(connString, function(err, client) {

            var sql = 'select ST_AsGeoJSON(geog) as shape ';
            sql = sql + 'from spatialschema.state_1 ';
            sql = sql + 'where geog && ST_GeogFromText(\'SRID=4326;POLYGON((' + bounds._southWest.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._southWest.lat + '))\') ';
            sql = sql + 'and ST_Intersects(geog, ST_GeogFromText(\'SRID=4326;POLYGON((' + bounds._southWest.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._southWest.lat + '))\'));';

            client.query(sql, function(err, result) {

                var featureCollection = require('../geoJson/featureCollection');

                for (i = 0; i < result.rows.length; i++)
                {
                    featureCollection.features.push(JSON.parse(result.rows[i].shape));
                }

                callback(featureCollection);
            });
        });
    }

};
