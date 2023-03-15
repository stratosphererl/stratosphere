import { useEffect, useRef } from "react";

import * as d3 from "d3";

interface Props {
    // Required props
    data: {[key: string]: number | string}[]; // Your data, a list of objects containing numbers for each sub_group and a string for the group
    group_label: string; // The key corresponding to the group (e.g. "name" or "label") in your data
    sub_groups: string[]; // The keys corresponding to the sub_groups (e.g. "goals", "shots", "saves", etc.) in your data

    // Optional props
    
    // General
    background_color?: string; // The background color of the graph
    svg_width?: number; // The total width of the component
    svg_height?: number; // The total height of the component
    padding?: number; // The padding around the graph

    // Column
    color_scale?: string[]; // The range of colors to use for each sub_group (note: if you don't provide enough, the colors will be reused)
    column_stroke_color?: string; // The color of the stroke around each sub_group, not each column
    column_stroke_width?: number; // The width of the stroke around each sub_group, not each column
    column_padding?: number; // The padding between each column
    default_oppacity?: number; // The default opacity of each column, becomes 1 when highlighted
    column_stroke_color_highlight?: string; // The color of the stroke around each sub_group when highlighted
    column_stroke_width_highlight?: number; // The width of the stroke around each sub_group when highlighted

    // Axis
    axis_color?: string; // The color of the axis and text on the axis
    axis_font_size?: number; // The font size of the axis and text on the axis
    axis_font?: string; // The font of the axis and text on the axis

    // tooltip
    tooltip_background_color?: string; // The background color of the tooltip
    tooltip_border_width?: number; // The border width of the tooltip
    tooltip_border_radius?: number; // The border radius of the tooltip (how rounded the corners are)
    tooltip_padding?: number; // The padding within the tooltip
    tooltip_text_color?: string; // The text color of the tooltip
    tooltip_font?: string; // The font of the tooltip
    tooltip_border_color?: string; // The border color of the tooltip
}

export default function PlayerBarGraph({
    data,
    group_label,
    sub_groups,

    background_color = "transparent",
    svg_width = 700,
    svg_height = 500,
    padding = 30,

    color_scale = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
    column_stroke_color = "black",
    column_stroke_width = 3,
    column_padding = .2,
    default_oppacity = .8,
    column_stroke_color_highlight = "black",
    column_stroke_width_highlight = 4,

    axis_color = "white",
    axis_font_size = 20,
    axis_font = "Montserrat",

    tooltip_background_color = "white",
    tooltip_border_width = 2,
    tooltip_border_radius = 5,
    tooltip_padding = 5,
    tooltip_text_color = "black",
    tooltip_font = "Montserrat",
    tooltip_border_color = "black",
}: Props) { 
    const ref = useRef(null);

    useEffect(() => {
        const graph_height = svg_height - 2 * padding;
        const graph_width = svg_width - 2 * padding;

        const refSelection = d3.select(ref.current)
            .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height)
                .style("background-color", background_color)
            .append("g")
                .attr("transform", "translate(" + padding + "," + padding + ")");

        const groups = d3.map(data, function(d){return(d[group_label])}) as string[];

        const x = d3.scaleBand()
            .domain(groups)
            .range([0, graph_width])
            .padding(column_padding);

        // dont even ask
        const max_column_height = Math.max(...data.map<number>((d: any) =>
                sub_groups.map<number>((sub_group) => d[sub_group]).reduce((x, y) => x + y)));

        const y = d3.scaleLinear()
            .domain([0, max_column_height])
            .range([graph_height, 0]);
        
        const color = d3.scaleOrdinal<string>()
            .domain(sub_groups)
            .range(color_scale);
        
        const stackedData = d3.stack<any, {[key: string]: string | number}, any>()
            .keys(sub_groups)
            (data)

        const Tooltip = d3.select(ref.current).append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", tooltip_background_color)
            .style("border", "solid")
            .style("border-color", tooltip_border_color)
            .style("border-width", tooltip_border_width + "px")
            .style("border-radius", tooltip_border_radius + "px")
            .style("padding", tooltip_padding + "px")
            .style("color", tooltip_text_color)
            .style("font-family", tooltip_font)
            .style("font-weight", "bold");

        const mouseover = function(this: any, event: any, d: any) {
            Tooltip
                .style("visibility", "visible");
            d3.select(this)
                .style("stroke", column_stroke_color_highlight)
                .style("stroke-width", column_stroke_width_highlight)
                .style("opacity", 1);
        }

        const mouseleave = function(this: any, event: any, d: any) {
            Tooltip
                .style("visibility", "hidden");
            d3.select(this)
                .style("stroke", column_stroke_color)
                .style("stroke-width", column_stroke_width)
                .style("opacity", default_oppacity);
        }

        const mousemove = function(this: any, event: any, d: any) {
            Tooltip
                .html(d[2] + ": " + (d[1] - d[0]))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 16) + "px");
        }

        refSelection.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")
                .attr("fill", d => color(d.key))
                .selectAll("rect")
                .data(function(d) {
                    const key = d.key;
                    return d.map((d) => {d.push(key); return d;});
                })
                .enter().append("rect")
                    .attr("x", (d) => x(d.data[group_label] as string) ?? 0)
                    .attr("y", (d) => y(d[1]))
                    .attr("height", (d) => y(d[0]) - y(d[1]))
                    .attr("width", x.bandwidth())
                    .attr("stroke", column_stroke_color)
                    .attr("stroke-width", column_stroke_width)
                    .style("opacity", default_oppacity)
                .on("mouseover", mouseover)
                .on("mouseleave", mouseleave)
                .on("mousemove", mousemove);

        refSelection.append("g")
            .attr("transform", "translate(0," + graph_height + ")")
            .style("color", axis_color)
            .style("font-size", axis_font_size + "px")
            .style("font-family", axis_font)
            .style("font-weight", "bold")
            .call(d3.axisBottom(x));

        refSelection.append("g")
            .style("color", axis_color)
            .style("font-size", axis_font_size + "px")
            .style("font-family", axis_font)
            .style("font-weight", "bold")
            .call(d3.axisLeft(y));

        return () => {
            d3.select(ref.current).selectAll("*").remove();
        }
        
    }, [ref]);

    return (
        <div ref={ref}></div>
    );
}
