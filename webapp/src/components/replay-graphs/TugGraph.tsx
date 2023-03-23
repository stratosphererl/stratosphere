import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface Props {
    data: [any, any]; // Tuple of two objects each containing a key for each sub_group
    sub_groups: string[]; // The keys corresponding to the sub_groups (e.g. "goals", "shots", "saves", etc.) in your data
    colors?: [string, string]; // The colors of the two teams

    svg_width?: number; // The total width of the component
    svg_height?: number; // The total height of the component
    outer_padding?: number; // The padding around the graph
    bar_padding?: number; // The padding between each bar

    stroke_color?: string; // The color of the stroke around each bar
    stroke_width?: number; // The width of the stroke around each bar
    oppacity?: number; // The opacity of each bar (The transparency makes it easy to dim color)

    font_size?: number; // The font size of the axis and text on the axis
    font?: string; // The font of the axis and text on the axis
    text_color?: string; // The color of the text
}

export default function TugGraph({
    data,
    sub_groups,
    colors = ["blue", "orange"],
    svg_width = 800,
    svg_height = 500,
    outer_padding = 10,
    bar_padding = .1,
    stroke_color = "black",
    stroke_width = 3,
    oppacity = .8,
    font_size = 40,
    font = "Montserrat",
    text_color = "white",
}: Props) {
    const ref = useRef(null);

    useEffect(() => {
        const cloned_data = data.map((d) => ({...d})) as [any, any];

        cloned_data.map((d) => {
            sub_groups.forEach((key) => {
                d[key] = typeof(d[key]) === "number" ? d[key] : 0;
            });
        });

        const totals = sub_groups.map<number>((key) => cloned_data[0][key] + cloned_data[1][key]);
        cloned_data.forEach((d) => {
            sub_groups.forEach((key, i) => {
                d[key] = {value: d[key], ratio: totals[i] ? d[key] / totals[i] : .5};
            });
        });

        const g = d3.select(ref.current)
            .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height)
            .append("g")
                .attr("transform", `translate(${outer_padding}, ${outer_padding})`);

        const width = svg_width - 2 * outer_padding;
        const height = svg_height - 2 * outer_padding;

        const x = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width]);

        const y = d3.scaleBand<string>()
            .domain(sub_groups)
            .range([0, height])
            .padding(bar_padding);

        cloned_data.forEach((team_data, idx) => {
            const team = g.append("g");
            team.append("g").selectAll("rect")
                .data(sub_groups)
                .enter()
                .append("rect")
                    .attr("x", (d) => idx ? x(1 - team_data[d].ratio) : 0)
                    .attr("y", (d) => y(d) ?? 0)
                    .attr("width", (d) => x(team_data[d].ratio))
                    .attr("height", y.bandwidth())
                    .attr("fill", colors[idx])
                    .attr("stroke", stroke_color)
                    .attr("stroke-width", stroke_width)
                    .attr("opacity", oppacity);
            team.append("g").selectAll("text")
                .data(sub_groups)
                .enter()
                .append("text")
                    .attr("x", (d) => idx ? width - font_size : font_size)
                    .attr("y", (d) => (y(d) ?? 0) + y.bandwidth() / 2)
                    .style("font-size", `${font_size}px`)
                    .style("font-family", font)
                    .attr("fill", text_color)
                    .style("text-anchor", "middle")
                    .style("alignment-baseline", "middle")
                    .style("font-weight", "bold")
                    .text((d) => team_data[d].value);
        });

        const sub_group_labels = g.append("g");

        sub_groups.forEach((key, i) => {
            sub_group_labels.append("text")
                .attr("x", width / 2)
                .attr("y", (y(key) ?? 0) + y.bandwidth() / 2)
                .style("font-size", `${font_size}px`)
                .style("font-family", font)
                .attr("fill", text_color)
                .style("text-anchor", "middle")
                .style("alignment-baseline", "middle")
                .style("font-weight", "bold")
                .text(key);
        });
        
        return () => {
            d3.select(ref.current).selectAll("*").remove();
        };
    }, [ref]);

    return (
        <div ref={ref} />
    );
}