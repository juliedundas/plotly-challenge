var samples = "data/samples.json";

function init() {
  // Use the D3 library to read in samples.json and console log it
  d3.json(samples).then(incomingData => {
    console.log(incomingData);
    // filter sample values by id
    var sample_id = incomingData.names;

    var dropDownMenu = d3.select("#selDataset");
    sample_id.forEach(id => {
      dropDownMenu
        .append("option")
        .text(id)
        .property("value", id);
    });
    //console.log(sample_id);

    //Create a horizontal bar chart with a dropdown menu
    //to display the top 10 OTUs found in that individual
    var firstID = sample_id[0];
    console.log(firstID);
    updateGraph(firstID);
    updateMetaData(firstID);
  });
}

function updateMetaData(sample) {
  d3.json(samples).then(incomingData => {
    var metaData = incomingData.metadata;
    // console.log(metaData);
    var filteredData = metaData.filter(object => object.id == sample);
    var result = filteredData[0];
    //console.log(graphed);
    var meta = d3.select("#sample-metadata");
    meta.html("");
    var results = Object.entries(result).forEach(([key, value]) => {
      meta.append("h6").text(`${key}: ${value}`);
      //console.log(results);
    });
    var wfreq = metaData.map(data => data.wfreq);
    //console.log(`Washing Freq: ${wfreq}`);

    //Data for Gauge Chart
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: "Belly Button Washing Frequency - Scrubs per Week",
        type: "indicator",
        mode: "gauge+number"
      }
    ];
    // Layout for Gauge Chart
    var layout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };

    Plotly.newPlot("gauge", data, layout);
  });
}

function updateGraph(sample) {
  d3.json("data/samples.json").then(incomingData => {
    var samples = incomingData.samples;
    // console.log(metaData);
    var filteredData = samples.filter(object => object.id === sample);
    var result = filteredData[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    //console.log(`Sample values: ${sample_values}`);
    //console.log(`OTU Ids: ${otu_ids}`);
    //console.log(`OTU Labels: ${otu_labels}`);

    //Create trace for bubble chart
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    //Create data for bubble chart
    var data = [trace1];
    var layout = {
      title: "Bacteria Cultures per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID " + sample },
      margin: { t: 30 }
    };
    Plotly.newPlot("bubble", data, layout);
    // Bar Chart
    //Trace for bar chart
    var trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      //Find top ten OTUs
      y: otu_ids
        .slice(0, 10)
        .map(otuID => `OTU ${otuID}`)
        .reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    //data for bar chart
    var data = [trace1];
    //Layout for bar chart
    var layout = {
      title: "Top Ten OTUs - Test Subject ID: " + sample,
      margin: { l: 100, r: 100, t: 100, b: 100 }
    };
    Plotly.newPlot("bar", data, layout);
  });
}

//updateMetaData();

// Use filter() to pass the function as its argument
//  var filteredArray = incomingData.filter(filterDataArray);

//  Check to make sure your are filtering your movies.
//   console.log(filteredArray);
//   console.log(filterDataArray);
// });

// Promise Pending
//const dataPromise = d3.json(samples);
//console.log("Data Promise: ", dataPromise);

//Initialize project
init();
