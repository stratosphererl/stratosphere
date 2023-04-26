import { useEffect, useRef } from "react";
import * as d3 from "d3";

const diameter = 300;
const radius = diameter / 2;

interface Props {
    className?: string; // Stylings to outer div
    data: { 
        name: string, // Name of the slice (displays in tooltip)
        value: number, // Value of slice
        color: string, // Color of the slice (note: works with all types of input, e.g. "red", "#ff0000", "rgb(255, 0, 0)", and "var(--warning-red)")
    }[];
    disableTooltip?: boolean; // Disable tooltip off by default
    disableOpacity?: boolean; // Disable opacity off by default
}
export default function PieChart({ className="", data, disableTooltip=false, disableOpacity=false }: Props) {
    const ref = useRef(null);

    useEffect(() => {
        const total = data.map(d => d.value).reduce((a, b) => a + b, 0);
        // const newData = data.map(d => ({...d, percent: d.value / total}));

        const svg = d3.select(ref.current)
            .append("svg")
                .attr("viewBox", `${-radius} ${-radius} ${diameter} ${diameter}`)
                .attr("preserveAspectRatio", "xMidYMid meet");

        const graphic = svg.append("g");

        const dataReady = d3.pie<{name: string, value: number, color: string}>()
            .value((d) => d.value)
            (data);
        
        const Tooltip = d3.select(ref.current).append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("text-align", "center")
            .style("color", "white")
            .style("font-family", "montserrat")
            .style("font-weight", "bold");

        const mouseover = function(this: any, event: any, d: any) {
            if (!disableTooltip)
                Tooltip
                    .style("visibility", "visible");
            const sel = d3.select(this)
                .style("opacity", 1);
        }

        const mouseleave = function(this: any, event: any, d: any) {
            Tooltip
                .style("visibility", "hidden");
            d3.select(this)
                .style("opacity", disableOpacity ? 1 : .9);
        }

        const mousemove = function(this: any, event: any, d: any) {
            const html = d.data.name + ": " + d.data.value;
            Tooltip
                .html(html)
                .style("left", (event.layerX - 10) + "px")
                .style("top", (event.layerY - 25) + "px");
        }

        graphic.selectAll("slice-path")
            .data(dataReady).enter().append("path")
                .attr("d", d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius) as any
                )
                .attr("fill", (d) => d.data.color)
                .attr("stroke", "777")
                .style("stroke-width", "2px")
                .style("opacity", disableOpacity ? 1 : .9)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

        return () => {
            d3.select(ref.current).selectAll("*").remove();
        }
    }, [ref]);

    return <div className={className} ref={ref} />;
}