// Setup data
var dataset = [];  // Initialize empty array
document.getElementsByClassName("pseudo_legend")[0].style.visibility="hidden";
function onStateChange(selected){
    
    executec(selected.value,document.getElementById("pivot_sel").value)
}
function onPivotChange(selected){
  
  document.getElementsByClassName("pseudo_legend")[0].style.visibility="visible";
  switch(selected.value){
    case("gender"):
      document.getElementById("blue").innerHTML="Male"
      document.getElementById("orange").innerHTML="Female"
      break
    case("designation"):
      document.getElementById("blue").innerHTML="Senior"
      document.getElementById("orange").innerHTML="Junior"
      break
    case("nativity"):
      document.getElementById("blue").innerHTML="Non-Native"
      document.getElementById("orange").innerHTML="Native"
      break
    case("abc"):
      document.getElementsByClassName("pseudo_legend")[0].style.visibility="hidden";
  }
  executec(document.getElementById("state_sel").value,selected.value)
}
var margin = { top: 20, right: 20, bottom: 80, left: 60 };
width = 960 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var tooltip = d3.select("#chart").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

var x = d3.scaleTime()
.range([0, width-margin.left])
.nice();

var y = d3.scaleLinear()
.range([height, 0]);
  
// *** Parse the date / time
var parseDate = d3.timeParse("%e/%m/%Y");
var formatDate = d3.timeFormat("%e/%m/%Y");
var parseTime = d3.timeParse("%H:%M:%S");
var formatTime = d3.timeFormat("%H:%M:%S");

// ***

  
// *** Scale the range of the data
var earliestDate = new Date("2002-12-31")
var latestDate = new Date("2018-12-31")

x.domain([earliestDate, latestDate]);
y.domain([0,2500]);


var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"));
var yAxis = d3.axisLeft(y).tickFormat(d3.format("d"));

var brush = d3.brush().extent([[0, 0], [width, height]]),
    idleTimeout,
    idleDelay = 350;
 
var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var clip = svg.append("defs").append("svg:clipPath")
.attr("id", "clip")
.append("svg:rect")
.attr("width", width )
.attr("height", height )
.attr("x", 0) 
.attr("y", 0); 

var scatter = svg.append("g")
.attr("id", "scatterplot")
.attr("clip-path", "url(#clip)");
        
// x axis
svg.append("g")
  .attr("class", "x axis")
  .attr('id', "axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")	
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");


    svg.append("text")
     .style("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 8)
     .text("Date");

// y axis
svg.append("g")
  .attr("class", "y axis")
  .attr('id', "axis--y")
  .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("Time");

scatter.append("g")
  .attr("class", "brush")
  .call(brush);

    var updateFilter = function(){
  
  var pivotKeys = d3.map(fullData, function(d){return d.pivot;}).keys();
  var filteredPivotArr = pivotKeys.filter(function(dataItem){
    var re = new RegExp("", "i");
    var result = dataItem.match(re);

    if(result != null){
      return true;
    } else {
      return false;
    }

  });


  var filteredPivotObj = [];

  for(var k in fullData){

    if(filteredPivotArr.includes(fullData[k].pivot)){

      filteredPivotObj.push(fullData[k]);
    }
  }

  plotData(filteredPivotObj);
    };


function plotData(data){
  
    scatter.selectAll(".dot").remove();
    scatter.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 4)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.time); })
    .attr("opacity", 0.5)
    .attr("data-legend",function(d) { return d.pivot})
    .style("fill", function(d) { return colour(d.pivot); })
    .on("mouseover", function(d) {
           tooltip.transition()
             .duration(200)
             .style("opacity", .9);
           tooltip.html(formatDate(d.date) + " " + formatTime(d.time) + "<br/>" + d.pivot)
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
                
         })
         .on("mouseout", function(d) {
           tooltip.transition()
             .duration(500)
             .style("opacity", 0);
         });
  }
    
        
  

  
  function idled() {
    idleTimeout = null;
  }
  
  function zoom() {
return
  }
function executec(state,pivot){
    
    fullData=dataset.filter(v=>v.cadre==state);
fullData.forEach(d=>{
    d.date = new Date(d.V7);
    d.time=d.V6;
    switch(pivot){
      case("abc"):
        d.pivot="abc"
        break
      case("designation"):
        d.pivot=d[pivot]?"Senior":"Junior"
        break
      case("nativity"):
        d.pivot=d.domicile==d.cadre?"Native":"Non Native"
        break
      case("gender"):
        d.pivot=d[pivot]
        break
    }
    
})

colour = d3.scaleOrdinal()
.domain(d3.map(fullData, function(d){return d.pivot;}).keys())
.range(d3.schemeCategory10);


plotData(fullData);
}
fetch("front2.json").then(function(res){
    return res.json()
}).then(function(resp){
    dataset=resp;
// *** Set up svg

executec("Punjab");




});