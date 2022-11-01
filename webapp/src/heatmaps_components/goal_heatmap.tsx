import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Hexbin, hexbin } from "d3-hexbin";

const MARGIN = {top: 20, right: 30, bottom: 30, left: 30};

interface dataType {
    x: number,
    y: number,
}
interface GoalProps {
    data?: dataType[];
    width?: number;
    height?: number;
}
const GoalHeatMap = (props: GoalProps) => {
    const ref = useRef(null);

    const fullWidth = props.width ? props.width : 500;
    const fullHeight = props.height ? props.height : 500;
    
    useEffect(() => {
        if (props.data && ref.current) {
            const width = fullWidth - MARGIN.left - MARGIN.right;
            const height = fullHeight - MARGIN.top - MARGIN.bottom;
            // set the dimensions and margins of the graph
            // append the svg object to the body of the page
            var svg = d3.select(ref.current)
                .append("svg")
                    .attr("width", fullWidth)
                    .attr("height", fullHeight)
                .append("g")
                    .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");
                    
            svg.append("image")
                    .attr("href", "https://cdn.suwalls.com/wallpapers/games/goal-in-the-utopia-coliseum-rocket-league-50374-2560x1600.jpg")
                    .attr("width", fullWidth)
                    .attr("height", fullHeight)
                    .attr("transform", "translate(" + (-MARGIN.left) + "," + (-MARGIN.top) + ")");

            // Build X scales and axis:
            var x = d3.scaleLinear()
                .nice()
                .domain([0,10])
                .range([ MARGIN.left, width - MARGIN.right ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
                    
            // Build X scales and axis:
            var y = d3.scaleLinear()
                .nice()
                .domain([0,10])
                .range([ height - MARGIN.bottom, MARGIN.top ])
            svg.append("g")
                .call(d3.axisLeft(y));

            // compute the density data
            var densityData = d3.contourDensity<{x: number, y: number}>()
                .x(function(d) { return x(d.x); })
                .y(function(d) { return y(d.y); })
                .size([width, height])
                .bandwidth(20)
                (props.data);

            // Prepare a color palette
            const color = d3.scaleLinear<string>()
                .domain([0, .0005]) // Number of points in the bin?
                .range(["orange", "green"]);
                    
            // show the shape!
            svg.insert("g", "g")
                .selectAll("path")
                .data(densityData)
                .enter().append("path")
                  .attr("d", d3.geoPath())
                  .attr("fill", function(d) { return color(d.value); });
        }
    }, [props.data, ref.current]);
          
    return (
        <svg 
            className="d3-component"
            width={fullWidth}
            height={fullHeight}
            ref={ref}
        />
    );
    
}
export default GoalHeatMap;