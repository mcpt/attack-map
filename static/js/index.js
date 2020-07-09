import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import countries from './countries.js'

fetch('/data')
.then(data => data.json())
.then(data => {
	let map = am4core.create("map", am4maps.MapChart);
	map.panBehavior = "rotateLongLat";
	map.geodata = am4geodata_worldLow;
	map.projection = new am4maps.projections.Orthographic();
	map.background.fill = am4core.color("#272822");
	map.background.fillOpacity = 1;
	map.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#3B3A32");
	map.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;

	let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
	polygonSeries.heatRules.push({
		"property": "fill",
		"target": polygonSeries.mapPolygons.template,
		"min": am4core.color("#142b30"),
		"max": am4core.color("#a3e8f5")
	});
	polygonSeries.useGeodata = true;
	polygonSeries.data = data.countries.map(country => {
		return {
			id: country.name,
			name: countries[country.name],
			value: Math.log(country.count),
			count: country.count
		}
	});
	

	let polygonTemplate = polygonSeries.mapPolygons.template;
	polygonTemplate.stroke = am4core.color("#A4A49F");
	polygonTemplate.fill = am4core.color("#49483E");
	polygonTemplate.tooltipText = "{name}: {count}";

	let imageSeries = map.series.push(new am4maps.MapImageSeries());

	let imageSeriesTemplate = imageSeries.mapImages.template;
	imageSeriesTemplate.propertyFields.latitude = "latitude";
	imageSeriesTemplate.propertyFields.longitude = "longitude";
	
	let circle = imageSeriesTemplate.createChild(am4core.Circle);
	circle.radius = 3;
	circle.fill = am4core.color("#fd971f");
	circle.stroke = am4core.color("#fecb8f");
	circle.strokeWidth = 1;
	circle.nonScaling = true;
	circle.tooltipText = "{count}";

	imageSeries.data = data.coordinates.map(coordinates => {
		return {
			latitude: coordinates.latitude / (10 ** 5),
			longitude: coordinates.longitude / (10 ** 5),
			count: coordinates.count
		}
	});


});