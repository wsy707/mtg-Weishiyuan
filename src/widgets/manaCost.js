import * as d3 from 'd3';

class ManaCost {
    build(data, element){
        const margin = {
            top: 30,
            right: 30,
            bottom: 70,
            left: 60
        }
        const width = 300 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(element)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('margin', margin.left)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xAxis = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.cost))
            .padding(0.2);

        svg.append('g')
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xAxis))
            .selectAll("text")
            .style("text-anchor", "end");

        const yAxis = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height, 0]);

        svg.append('g')
            .call(d3.axisLeft(yAxis))

        svg.selectAll("costBar")
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => xAxis(d.cost))
            .attr('y', d => yAxis(d.count))
            .attr('width', xAxis.bandwidth())
            .attr('height', d =>  height - yAxis(d.count) )
            .attr('fill', "#69b3a2")

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -height / 2)
            .text("Number of Cards");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .text("Mana Cost");
    }
}

export {ManaCost}