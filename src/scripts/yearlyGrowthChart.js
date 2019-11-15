export const yearlyGrowthChart = (dataset) => {
    //determine chart size
    const margin = 60; // give a little extra padding to the chart
    const width = 1100; 
    const height = 500;
    
    let yMax = 0;
    for (let datum of dataset) {
        if (datum.fees > yMax) {yMax = datum.fees}
    }
    yMax = Math.ceil(yMax * 1.1 / 100) * 100; // max value 
    
    const svg = d3.select('svg')
        .attr("width", width + (margin * 2))
        .attr("height", height + margin);
    
    const chart = svg.append('g')
        .attr('transform', `translate(${margin},0)`) // move the start of the chart to the (60;60) position of the SVG

    const yScale = d3.scaleLinear()
        .range([height, 0]) // svg coordinates go from top to bottom hence, height being first
        .domain([0, yMax])

    // chart.append('g')
    //     .call(d3.axisLeft(yScale)); // add scale for the y axis

    // x axis
    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(dataset.map((d) => d.year))
        .padding(0.2)
    
    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    chart.selectAll()
        .data(dataset)
        .enter()
        .append('rect')
        .style("fill", "rgb(7,104,110)")
        .attr('class', 'bar')
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.fees))
        .attr('height', (d) => height - yScale(d.fees))
        .attr('width', xScale.bandwidth())

    //vertical grid lines
    // chart.append('g')
    //     .attr('class', 'grid')
    //     .attr('transform', `translate(0, ${height})`)
    //     .call(d3.axisBottom()
    //     .scale(xScale)
    //     .tickSize(-height, 0, 0)
    //     .tickFormat(''))

    //horizontal grid lines
    // chart.append('g')
    //     .attr('class','grid')
    //     .call(d3.axisLeft()
    //     .scale(yScale)
    //     .tickSize(-width,0,0)
    //     .tickFormat(''))

    //verticle axis label
    // svg.append('text')
    //     .attr('x', -(height / 2 - margin))
    //     .attr('y', margin / 2.4)
    //     .attr('transform', 'rotate(-90)')
    //     .attr('text-anchor', 'middle')
    //     .text('Underwriting Commissions ($m)')

    //horizontal axis label
    // svg.append('text')
    //     .attr('x', width / 2 + margin)
    //     .attr('y', height - 10)
    //     .attr('text-anchor', 'middle')
    //     .text('Year')

    //interactivity
    // svgElement
    //     .on('mouseenter', function (actual, i) {
    //         d3.select(this).attr('opacity', 0.5)
    //     })
    //     .on('mouseleave', function (actual, i) {
    //         d3.select(this).attr('opacity', 1)
    //     })

    svg.selectAll(".text")
        .data(dataset)
        .enter()
        .append("text")
        .attr('class', "label")
        .attr("x", function(d, i) {
            return (275/2 + 58/2 + 275 * i + 68.75 * (i + 1) ) 
        })
        .attr("y", function(d) {
            return yScale(d.fees) - 5
        })
        .text(function(d) {
            let labelized = `$ ${d.fees} m`
            return labelized; 
        });
}

