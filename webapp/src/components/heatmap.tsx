import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
    data: {x: number, y: number}[];
    width?: number;
    height?: number;
    margin?: {top: number, right: number, bottom: number, left: number};
    image?: string;
    bandwidth?: number;
    binColor?: number;
    xDomain?: [number, number];
    yDomain?: [number, number];
}
export default function Heatmap({
    data, width = 100, height = 100, margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }, image, bandwidth = 3, binColor = .01, xDomain = [0, 10], yDomain = [0, 10],
}: Props) {
    const ref = useRef(null);

    useEffect(() => {
        if (data && ref.current) {
            const refSelection = d3.select(ref.current);

            if (image)
                refSelection.append("image")
                    .attr("href", image)
                    .attr("width", width)
                    .attr("height", height);

            const gWidth = width - margin.left - margin.right;
            const gHeight = height - margin.top - margin.bottom;

            const svg = refSelection
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Build X scales and axis:
            var x = d3.scaleLinear()
                .nice()
                .domain(xDomain)
                .range([0, gWidth]);
            //svg.append("g")
            //    .attr("transform", "translate(0," + gHeight + ")")
            //    .call(d3.axisBottom(x));
            // Build X scales and axis:
            var y = d3.scaleLinear()
                .nice()
                .domain(yDomain)
                .range([gHeight, 0]);
            //svg.append("g")
            //    .call(d3.axisLeft(y));
            // compute the density data
            var densityData = d3.contourDensity<{ x: number; y: number; }>()
                .x(function (d) { return x(d.x); })
                .y(function (d) { return y(d.y); })
                .size([gWidth, gHeight])
                .bandwidth(bandwidth)(data);

            // Prepare a color palette
            const color = d3.scaleLinear<string>()
                .domain([0, binColor]) // Number of points in the bin?
                .range(["blue", "red"]);

            // show the shape!
            svg.insert("g", "g")
                .selectAll("path")
                .data(densityData)
                .enter().append("path")
                .attr("d", d3.geoPath())
                .attr("fill", function (d) { return color(d.value); });
        }
    }, [data, ref.current]);

    return (
        <svg
            className="d3-component"
            width={width}
            height={height}
            ref={ref} />
    );

}