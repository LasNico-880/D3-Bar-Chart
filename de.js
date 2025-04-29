const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then(response => response.json())
  .then(data => {
    const dataset = data.data;
    
    const w = 900;
    const h = 500;
    const padding = 60;

    const svg = d3.select("svg");

    const xScale = d3.scaleTime()
      .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
      .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([h - padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - padding})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    const barWidth = (w - 2 * padding) / dataset.length;

    const tooltip = d3.select("#tooltip");

    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("x", d => xScale(new Date(d[0])))
      .attr("y", d => yScale(d[1]))
      .attr("width", barWidth)
      .attr("height", d => h - padding - yScale(d[1]))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Fecha: ${d[0]}<br/>PIB: $${d[1]} Billones`)
          .attr("data-date", d[0])
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 40) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  });
