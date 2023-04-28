import { useEffect, useRef } from "react";
import * as d3 from "d3";

import data from "./mock_data/position_heatmap_data";

const svg_width = 500;
const svg_height = 500;
const padding = 50;

const [x_min, x_max] = [-5000, 5000];
const [y_min, y_max] = [-7500, 7500];

interface Props {

};

export default function PositionHeatmap(props: Props) {
    const ref = useRef(null);
    
    useEffect(() => {
        const g = d3.select(ref.current)
            .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height)
                .style("background-color", "white")
            .append("g")
                .attr("transform", `translate(${padding}, ${padding})`);

        const width = svg_width - 2 * padding;
        const height = svg_height - 2 * padding;

        const x = d3.scaleLinear()
            .domain([x_min, x_max])
            .range([0, width]);
        
        const y = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([height, 0]);

        const color = d3.scaleLinear<string>()
            .domain(d3.ticks(0, .05, 5))
            .range(["transparent", "grey", "green", "red"]);

        const densityData = d3.contourDensity()
            .x((d: any) => x(d.x))
            .y((d: any) => y(d.y))
            .size([width, height])
            .bandwidth(5)
            (data);

        g.insert("g", "g")
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
                .attr("d", d3.geoPath())
                .attr("fill", (d) => color(d.value));

        g.append("g")
            .attr("transform", `translate(0, ${height})`)
            .style("color", "black")
            .call(d3.axisBottom(x));

        g.append("g")
            .style("color", "black")
            .call(d3.axisLeft(y));

        return () => {
            d3.select(ref.current).selectAll("*").remove();
        };
    }, [ref]);

    return (
        <div ref={ref} />
    )
}