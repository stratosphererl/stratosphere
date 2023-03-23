import { useRef, useEffect } from "react";
import * as d3 from "d3";

import data from "./position_heatmap_data";

const svg_width = 500;
const svg_height = 500;
const padding = 50;

const [x_min, x_max] = [-5000, 5000];
const [y_min, y_max] = [-7500, 7500];

const size = 5;

interface Props {

};

export default function TestPositionHeatmap(props: Props) {
    const ref = useRef(null);

    const width = svg_width - 2 * padding;
    const height = svg_height - 2 * padding;

    useEffect(() => {
        const destroy = () => {
            d3.select(ref.current).selectAll("*").remove();
        };

        const x = d3.scaleLinear()
            .domain([x_min, x_max])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([height, 0]);

        const color = d3.scaleLinear<string>()
            .domain(d3.ticks(0, 10, 4))
            .range(["transparent", "grey", "green", "red"]);

        const mapped_data = data.map<[number, number]>(d => [x(d.x), y(d.y)]);

        const g = d3.select(ref.current)
            .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height)
                .style("background-color", "white")
            .append("g")
                .attr("transform", `translate(${padding}, ${padding})`);

        const foreignObject = g.append("foreignObject")
            .attr("width", width)
            .attr("height", height);

        const foreignBody = foreignObject.append("xhtml:body")
            .style("margin", "0px")
            .style("padding", "0px")
            .style("background-color", "white")
            .style("width", `${width}px`)
            .style("height", `${height}px`);

        const canvas = foreignBody.append<"canvas">("canvas")
            .attr("width", width)
            .attr("height", height)
            .style("width", `${width}px`)
            .style("height", `${height}px`)
            .node();
            
        const context = canvas?.getContext("2d");
        const image = context?.createImageData(width, height);

        // console.log(canvas, context, image)

        if (context && image) {
            const bucket_size = size * 2;

            const columns = Math.ceil(width / bucket_size);
            const rows = Math.ceil(height / bucket_size);
            const buckets: [number, number][][][] = new Array(rows).fill(0).map(() => new Array(columns).fill(0).map(() => []));

            mapped_data.forEach(([x, y]) => {
                const col = Math.floor(x / bucket_size);
                const row = Math.floor(y / bucket_size);

                buckets[row][col].push([x, y]);
            });

            const get_weight = (x: number, y: number) => {
                const col = Math.floor(x / bucket_size);
                const row = Math.floor(y / bucket_size);

                const buckets_to_check = [];
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < columns) {
                            buckets_to_check.push(buckets[row + i][col + j]);
                        }
                    }
                }

                var weight = 0;
                buckets_to_check.forEach(bucket => {
                    bucket.forEach(([x1, y1]) => {
                        const dx = x - x1;
                        const dy = y - y1;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < size) {
                            weight += 1;
                        } else if (distance < 2 * size) {
                            weight += 1 - (distance - size) / size;
                        }
                    });
                });

                return weight;
            };

            var pointer = -1;
            d3.range(0, height).forEach(y => {
                d3.range(0, width).forEach(x => {
                    const current_color = d3.rgb(color(get_weight(x, y)));

                    image.data[++pointer] = current_color.r;
                    image.data[++pointer] = current_color.g;
                    image.data[++pointer] = current_color.b;
                    image.data[++pointer] = current_color.opacity * 255;
                });
            });
            context.putImageData(image, 0, 0);
        }
        
        g.append("g")
            .attr("transform", `translate(0, ${height})`)
            .style("color", "black")
            .call(d3.axisBottom(x));

        g.append("g")
            .style("color", "black")
            .call(d3.axisLeft(y));

        return destroy;
    }, [ref]);

    return (
        <div ref={ref} />
    )
}