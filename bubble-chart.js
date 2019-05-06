(function(){
      var width = 1050,
        height = 600;

      var svg = d3.select("#bubble_chart")
        .append("svg")
        .attr("height",height)
        .attr("width",width)
        .append("g")
        .attr("transform","translate(0,0)")

      var radiusScale = d3.scaleSqrt().domain([1,5]).range([25,60])

      var forceXSperate_pro = d3.forceX(function(d) {
      		if (d.programming === 'required') {
      			return 230
      		} else { return 710}
      }).strength(0.05)

      var forceXSperate_inter = d3.forceX(function(d) {
      		if (d.interactivity === 'interactive') {
      			return 300
      		} else { return 750}
      }).strength(0.05)

      var forceXCombine = d3.forceX(width / 2).strength(0.05)

      var forceCollide = d3.forceCollide(function(d) {
      		return radiusScale(d.popularity)+2
      })



      var simulation = d3.forceSimulation()
        .force("x",forceXCombine)
        .force("y",d3.forceY(height / 2).strength(0.05))
        .force("collide", forceCollide)

      d3.queue()
        .defer(d3.csv,"bubble.csv")
        .await(ready)

      function ready (error,datapoints) {
        var circles = svg.selectAll(".names")
          	.data(datapoints)
          	.enter().append("circle")
          	.attr("class","names")
          	.attr("r",function(d) {
            	return radiusScale(d.popularity)})
          	//.attr("fill","lightblue")
          	.attr("fill",function(d) {
          		return d.licence == "Open_source" ? "#CBD7D2" : 
          				 d.licence == "paid" ? "#ffee72" :
          				 	d.licence == "free" ? "#D8D3CB" :"#e4ff8e"})
            .on("mouseover", function()
            {
              tooltip.style("display",null);
            })

            .on("mouseout",function()
            {
              tooltip.style("display","none");
            })

            .on("mousemove", function(d){
              var xPos = d3.mouse(this)[0];
              var yPos = d3.mouse(this)[1];
              tooltip.attr("transform","translate("+ xPos +","+ yPos +")");
              tooltip.select("text").text(d.name + "/" +"popularity:"+ d.popularity);
            });

      var tooltip = svg.append("g")
        .attr("class",tooltip)
        .style("display","none");

      tooltip.append("text")
        .attr("x",15)
        .attr("dy", "1.2em")
        .style("font-size", "1.25em")
        .attr("font-weight", "bold")
        	

  		d3.select("#Programming").on('click', function(d) {
  			simulation
  				.force("x", forceXSperate_pro)
  				.alphaTarget(0.55)
  				.restart()
  		})

  		d3.select("#Interactivity").on('click', function(d) {
  			simulation
  				.force("x", forceXSperate_inter)
  				.alphaTarget(0.55)
  				.restart()
  		})

  		d3.select("#Combine").on('click', function(d) {
  			simulation
  				.force("x", forceXCombine)
  				.alphaTarget(0.55)
  				.restart()
  		})

        
        
        simulation.nodes(datapoints) //feed simulation in the nodes
          .on('tick', ticked)

        function ticked() {
          circles
            .attr("cx",function(d){
              return d.x
            })
            .attr("cy",function(d) {
              return d.y
            })                        //
        }
      }
    })();


    