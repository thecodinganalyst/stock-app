import * as d3 from "d3";
import { useTheme } from '@mui/material/styles';
import {useEffect, useRef, useState} from "react";
import './chart.css'
import {Button} from "@mui/material";

export default function Chart({
                                  dataSets = new Map(),
                                  timestamps = [],
                                  labels = [],
                                  width = 800,
                                  height = 400,
                                  marginTop = 20,
                                  marginRight = 40,
                                  marginBottom = 40,
                                  marginLeft = 40
                              }) {
    const theme = useTheme();
    const colors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.error.main
    ];

    const [zoomedDomain, setZoomedDomain] = useState(null);

    // Convert the timestamp array to Date objects
    const timestampDates = timestamps.map(ts => new Date(ts * 1000));

    const allData = [].concat(...Array.from(dataSets.values()));

    const x = d3.scaleTime()
        .domain(timestampDates.length > 0 ? d3.extent(timestampDates) : [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()])
        .range([marginLeft, width - marginRight]);

    if (zoomedDomain) {
        x.domain(zoomedDomain);
    }

    const y = d3.scaleLinear()
        .domain(allData.length > 0 ? d3.extent(allData) : [0, 10])
        .range([height - marginBottom, marginTop]);

    const line = d3.line()
        .x((_, i) => x(timestampDates[i]))
        .y(d => y(d));

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    function resetZoom() {
        setZoomedDomain(null);
    }

    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const brush = d3.brushX()
            .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])
            .on("end", (event) => {
                if (!event.selection) return;
                const [startX, endX] = event.selection;
                const newDomain = [x.invert(startX), x.invert(endX)];
                setZoomedDomain(newDomain);

                // Apply the zoom transform to match the brush selection
                const svg = d3.select(svgRef.current);
                svg.transition().call(
                    zoomBehavior.transform,
                    d3.zoomIdentity.scale(width / (endX - startX)).translate(-startX, 0)
                );

                svg.select(".brush").call(brush.move, null); // Clear brush selection
            });

        const zoomBehavior = d3.zoom()
            .scaleExtent([1, 10])
            .translateExtent([[marginLeft, -Infinity], [width - marginRight, Infinity]])
            .extent([[marginLeft, -Infinity], [width - marginRight, Infinity]])
            .on("zoom", (event) => {
                // Check if the zoom was triggered by a brush event
                if (event.sourceEvent && event.sourceEvent.type.startsWith('brush')) return;

                const newDomain = event.transform.rescaleX(x).domain();
                setZoomedDomain(newDomain);
            });

        svg.select(".brush").call(brush);
        svg.call(zoomBehavior);

    }, [width, height, x, marginBottom, marginTop, marginRight, marginLeft]);

    return (
        <div style={{ width: `${width}px`, maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" ref={svgRef}>
                <g className="brush" />
                <g transform={`translate(0, ${height - marginBottom})`}>
                    <g ref={node => d3.select(node).call(xAxis)} />
                </g>
                <g transform={`translate(${marginLeft}, 0)`}>
                    <g ref={node => d3.select(node).call(yAxis)} />
                </g>
                {Array.from(dataSets.entries()).map(([key, data]) => {
                    const colorIdx = labels.indexOf(key);
                    const color = colors[colorIdx];

                    return (
                        <g key={`dataSet-${key}`}>
                            <path
                                fill="none"
                                stroke={color}
                                strokeWidth="1.5"
                                d={line(data)}
                            />
                        </g>
                    )
                })}
            </svg>
            <Button variant="outlined" onClick={resetZoom}>Reset Zoom</Button>
        </div>
    );
}
