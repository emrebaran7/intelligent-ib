export const initialBarChart = (dataset) => {
    const svgWidth = 500, svgHeight = 300, barPadding = 5;
    const barWidth = (svgWidth / dataset.length);
    const svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    const barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function (d) {
            return svgHeight - d / 5
        })
        .attr("height", function (d) {
            return d;
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function (d, i) {
            var translate = [barWidth * i, 0];
            return "translate(" + translate + ")";
        });
}

