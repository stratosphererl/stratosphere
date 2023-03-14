import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface Props {
    keys: string[]; // Keys corresponding to legend items (bottom to top)
    colors?: string[]; // Colors corresponding to legend items (bottom to top) (will repeate colors if not enough provided)

    text_color?: string; // "match" or actual color
    font?: string; // Font of text

    background_color?: string; // Background color of legend
    svg_width?: number; // Width of legend
    svg_height?: number; // Height of legend
    padding?: number; // Padding within legend

    border_color?: string; // Color of border
    border_width?: number; // Width of border
    border_radius?: number; // Radius of border

    use_circle?: boolean; // Use circle instead of square
    stroke_color?: string; // Color of stroke around square/circle
    stroke_width?: number; // Width of stroke around square/circle
    stroke_radius?: number; // Radius of square (aka how rounded the corners are)
    spacing?: number; // Spacing between items
}

export default function GraphLegend({
    keys,
    colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],

    text_color = "match",
    font = "Montserrat",

    background_color = "transparent",
    svg_width = 300,
    svg_height = 200,
    padding = 5,

    border_color = "black",
    border_width = 0,
    border_radius = 0,

    use_circle = false,
    stroke_color = "black",
    stroke_width = 2,
    stroke_radius = 5,
    spacing = 5,
}: Props) {
    const ref = useRef(null);

    keys = [...keys].reverse();
    colors = [...colors].reverse();

    useEffect(() => {
        const g = d3.select(ref.current)
            .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height)
                .style("background-color", background_color)
                .style("border", `${border_width}px solid ${border_color}`)
                .style("border-radius", `${border_radius}px`)
            .append("g")
                .attr("transform", `translate(${padding}, ${padding})`);

        const height = svg_height - 2 * padding - 2 * border_width;
        const size = (height + spacing) / keys.length - spacing;

        const color = d3.scaleOrdinal<string>()
            .domain(keys)
            .range(colors);

        g.selectAll("mydots")
            .data(keys)
            .enter()
            .append("rect")
                .attr("y", (d, i) => i * (size + spacing))
                .attr("width", size)
                .attr("height", size)
                .style("fill", (d) => color(d))
                .style("stroke", stroke_color)
                .style("stroke-width", `${stroke_width}px`)
                .style("rx", `${use_circle ? size : stroke_radius}px`);

        
        g.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
                .attr("x", size*1.2)
                .attr("y", (d, i) => i*(size + spacing) + (size/2))
                .style("fill", (d) => text_color == "match" ? color(d) : text_color)
                .text((d) => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", (size * .8) + "px")
                .style("font-family", font);

        return () => {
            d3.select(ref.current).selectAll("*").remove();
        }
    }, [ref]);

    return (
        <div ref={ref} />
    );
}