import { useEffect, useRef } from "react";
import * as d3 from "d3";

import ball from "../../assets/ball.png";

interface Props {
    data: any[]; // Data is an array of objects with keys corresponding to the data you want to display and a required "x" and "y" key
    data_display?: string[]; // The keys corresponding to the data you want to display in the tooltip
    postfixes?: {[key: string]: string}; // The postfixes to display after each data_display key in the tooltip

    svg_width?: number; // The total width of the component
    svg_height?: number; // The total height of the component

    ball_size?: number; // The size of the ball

    x_max?: number; // The maximum value of the x axis (game's net width)
    y_max?: number; // The maximum value of the y axis (game's net height)

    default_oppacity?: number; // The default opacity of the ball

    tooltip_background_color?: string; // The background color of the tooltip
    tooltip_border_width?: number; // The border width of the tooltip
    tooltip_border_radius?: number; // The border radius of the tooltip (how rounded the corners are)
    tooltip_border_color?: string; // The border color of the tooltip
    tooltip_padding?: number; // The padding within the tooltip
    tooltip_text_color?: string; // The text color of the tooltip
    tooltip_font?: string; // The font of the tooltip

    overlayed_image?: string | null; // The image to overlay on the graph
    underlayed_image?: string | null; // The image to underlay on the graph
}

export default function GoalChart({
    data,
    data_display = [],
    postfixes = {},

    svg_width = 800,
    svg_height = 600,

    ball_size = 80,

    x_max = 1000,
    y_max = 750,

    default_oppacity = .8,

    tooltip_background_color = "white",
    tooltip_border_width = 2,
    tooltip_border_radius = 5,
    tooltip_border_color = "black",
    tooltip_padding = 5,
    tooltip_text_color = "black",
    tooltip_font = "Montserrat",

    overlayed_image = null,
    underlayed_image = null,
}: Props) {
    const ref = useRef(null);

    useEffect(() => {
        data_display.forEach((key) => {if (!postfixes[key]) postfixes[key] = "";});

        d3.selection.prototype.moveToFront = function(this: any) {
            return this.each(function(this: any){
                this.parentNode.appendChild(this);
            });
        };
        
        const width = svg_width;
        const height = svg_height;
       
        const svg = d3.select(ref.current)
            .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height);
        const g = svg.append("g");

        if (underlayed_image) {
            svg.style("background-image", "url(" + underlayed_image + ")")
                .style("background-size", "contain")
                .style("background-repeat", "no-repeat");
        }
        if (overlayed_image) {
            svg.append("svg:image")
                .attr("xlink:href", overlayed_image)
                .attr("width", width)
                .attr("height", height);
        }

        const x = d3.scaleLinear()
            .domain([0, x_max])
            .range([0, width]);
        
        const y = d3.scaleLinear()
            .domain([0, y_max])
            .range([height, 0]);

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
            (d3.select(this)
                .style("opacity", 1) as any).moveToFront();
        }

        const mouseleave = function(this: any, event: any, d: any) {
            Tooltip
                .style("visibility", "hidden");
            d3.select(this)
                .style("opacity", default_oppacity);
        }

        const mousemove = function(this: any, event: any, d: any) {
            const html = "" + 
            Tooltip
                .html(data_display.map((key) => {
                    return key + ": " + d[key] + postfixes[key];
                }).join("<br/>"))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - data_display.length * 15) + "px");
        }

        g.selectAll("circles")
            .data(data)
            .enter()
            .append("svg:image")
                .attr("xlink:href", ball)
                .attr("x", (d) => x(d.x) - ball_size / 2)
                .attr("y", (d) => y(d.y) - ball_size / 2)
                .attr("width", ball_size)
                .attr("height", ball_size)
                .attr("opacity", default_oppacity)
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .on("mousemove", mousemove);

        return () => {
            d3.select(ref.current).selectAll("*").remove();
        };
    }, [ref]);

    return (
        <div ref={ref} />        
    );
}