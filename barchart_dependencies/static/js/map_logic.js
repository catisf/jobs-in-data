// Define a global variable to store cleaned data
let mapData;

anychart.onDocumentReady(function () {
    // load the data
    anychart.data.loadJsonFile("/print_sample_data_all", function (data) {
        mapData = JSON.parse(data.cleaned_data_all);

        console.log(mapData)

        // Define an empty array to store the job counts for each country

        d3.json("./static/js/countries.geojson").then(function(geojson) {
            let geoData = geojson.features;
            console.log(geoData)

            // Sum the number of jobs in each country
            let numJobs = {};
            mapData.forEach(function(job) {
                let country = job.company_location; 
                if (!numJobs[country]) {
                    numJobs[country] = 0;
                }
                numJobs[country]++;
            });

            // Save data in the right format for anychart
            let countryData = [];
            Object.keys(numJobs).forEach(function(country) {
            let countryID = null;
            // Find the feature in geoData that matches the country name
            let feature = geoData.find(feature => feature.properties.ADMIN === country); 
            if (feature) {
                countryID = feature.properties.ISO_A2; 
            }
            countryData.push({ id: countryID, value: numJobs[country], name: country });
            });       

            // Connect the data with the map
            var chart = anychart.map(countryData);

            // Set the map data
            chart.geoData(anychart.maps.world);

            // Create choropleth series
            var series = chart.choropleth(countryData);

            // Define color scale ranges
            var ocs = anychart.scales.ordinalColor([
                { less: 10 },
                { from: 10, to: 99 },
                { from: 100, to: 199 },
                { from: 200, to: 299 },
                { from: 300, to: 399 },
                { from: 400, to: 499 },
                { from: 500, to: 599 },
                { greater: 600 }
            ]);

            // Set scale colors
            ocs.colors(["rgb(236,231,242)","rgb(208,209,230)", "rgb(166,189,219)", "rgb(116,169,207)", "rgb(54,144,192)", "rgb(5,112,176)", "rgb(4,90,141)", "rgb(2,56,88)"]);       

            // Apply color scale to the series
            series.colorScale(ocs);

            // Set legend
            chart.colorRange().enabled(true);

            // Improve tooltip
            series.tooltip()
            .useHtml(true)
            .format(function (d) {
                return ("<h6 style='font-size:14px; font-weight:400; margin: 0.2rem 0;'> Jobs added:" + d.value + "</h6>");
            });

            // Set the container id
            chart.container('mapContainer');

            // Draw the chart
            chart.draw();
        });
    });
});