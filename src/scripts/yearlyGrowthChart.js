export const yearlyGrowthChart = (dataset) => {
    //determine chart size
    const margin = 60; // give a little extra padding to the chart
    const width = 1000; 
    const height = 800;
    
    let yMax = 0;
    for (let datum of dataset) {
        if (datum.fees > yMax) {yMax = datum.fees}
    }
    yMax = Math.ceil(yMax * 1.1 / 100) * 100; // max value 
    
    const svg = d3.select('svg')
        .attr("width", width)
        .attr("height", height );
    
    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, -${margin})`) // move the start of the chart to the (60;60) position of the SVG

    const yScale = d3.scaleLinear()
        .range([height, 0]) // svg coordinates go from top to bottom hence, height being first
        .domain([0, yMax])

    chart.append('g')
        .call(d3.axisLeft(yScale)); // add scale for the y axis

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
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.fees))
        .attr('height', (d) => height - yScale(d.fees))
        .attr('width', xScale.bandwidth())
}

