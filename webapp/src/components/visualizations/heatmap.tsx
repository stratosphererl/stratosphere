import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface Props {
    data: {x: number, y: number}[];

    overlayed_image?: string | null;
    underlayed_image?: string | null;

    x_domain?: [number, number];
    y_domain?: [number, number];

    size?: number;

    svg_width?: number;
    svg_height?: number;

    color_range?: string[];
    color_density?: number;
};

export default function Heatmap({
    data,

    overlayed_image = null,
    underlayed_image = null,

    x_domain = [0, 1],
    y_domain = [0, 1],

    size = 5,

    svg_width = 500,
    svg_height = 500,

    color_range = ["transparent", "grey", "green", "red"],
    color_density = 10,
}: Props) {
    const ref = useRef(null);

    const width = svg_width;
    const height = svg_height;

    useEffect(() => {
        const destroy = () => {
            d3.select(ref.current).selectAll("*").remove();
        };

        const x = d3.scaleLinear()
            .domain(x_domain)
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain(y_domain)
            .range([height, 0]);

        const color = d3.scaleLinear<string>()
            .domain(d3.ticks(0, color_density, color_range.length))
            .range(color_range);

        const mapped_data = data.map<[number, number]>(d => [x(d.x), y(d.y)]);

        const svg = d3.select(ref.current)
            .append("svg")
                .attr("viewBox", `0 0 ${svg_width} ${svg_height}`)
                .attr("preserveAspectRatio", "xMidYMid meet");
                // .attr("width", svg_width)
                // .attr("height", svg_height); 

        const g = svg.append("g");

        if (underlayed_image) {
            svg.style("background-image", `url(${underlayed_image})`)
                .style("background-size", "cover")
                .style("background-repeat", "no-repeat");
        }
        if (overlayed_image) {
            svg.append("image")
                .attr("href", overlayed_image)
                .attr("width", svg_width)
                .attr("height", svg_height);
        }

        const foreignObject = g.append("foreignObject")
            .attr("width", width)
            .attr("height", height);

        const foreignBody = foreignObject.append("xhtml:body")
            .style("width", `${width}px`)
            .style("height", `${height}px`)
            .style("margin", "0px")
            .style("padding", "0px")
            .style("background-color", "transparent");

        const canvas = foreignBody.append<"canvas">("canvas")
            .attr("width", width)
            .attr("height", height)
            .style("width", `${width}px`)
            .style("height", `${height}px`)
            .node();
            
        const context = canvas?.getContext("2d");
        const image = context?.createImageData(width, height);

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

        return destroy;
    }, [ref]);

    return (
        <div className="w-full" ref={ref} />
    )
}