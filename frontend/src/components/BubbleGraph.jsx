import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import styles from './BubbleGraph.module.css';

function BubbleGraph({ graphData, points, onPointUpdate }) {
  const [draggedPoint, setDraggedPoint] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, pointX: 0, pointY: 0 });
  const containerRef = useRef(null);

  const getBubbleSize = (size) => {
    const minSize = 1.5;
    const maxSize = 3.5;
    const minDiameter = 20;
    const maxDiameter = 70;
    
    const normalized = (size - minSize) / (maxSize - minSize);
    const diameter = minDiameter + normalized * (maxDiameter - minDiameter);
    
    return Math.round(diameter);
  };

  const getChartBounds = useCallback(() => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();

    return {
      left: 80,
      right: rect.width - 20,
      top: 20,
      bottom: rect.height - 60,
      width: rect.width - 100,
      height: rect.height - 80,
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!draggedPoint) return;
    
    const bounds = getChartBounds();
    if (!bounds) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const xDelta = (deltaX / bounds.width) * (graphData.xAxis.max - graphData.xAxis.min);
    const yDelta = -(deltaY / bounds.height) * (graphData.yAxis.max - graphData.yAxis.min);
    
    const newX = Math.max(
      graphData.xAxis.min,
      Math.min(graphData.xAxis.max, dragStart.pointX + xDelta)
    );
    const newY = Math.max(
      graphData.yAxis.min,
      Math.min(graphData.yAxis.max, dragStart.pointY + yDelta)
    );
    
    const updatedPoints = points.map((p) =>
      p.id === draggedPoint
        ? { ...p, x: Math.round(newX), y: Math.round(newY) }
        : p
    );
    
    onPointUpdate(updatedPoints);
  }, [draggedPoint, dragStart, graphData, getChartBounds, points, onPointUpdate]);

  const handleMouseUp = useCallback(() => {
    setDraggedPoint(null);
    setDragStart({ x: 0, y: 0, pointX: 0, pointY: 0 });
  }, []);

  useEffect(() => {
    if (draggedPoint) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedPoint, handleMouseMove, handleMouseUp]);

  const handleBubbleMouseDown = useCallback((e, point) => {
    e.preventDefault();
    e.stopPropagation();
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    setDraggedPoint(point.id);
    setDragStart({
      x: mouseX,
      y: mouseY,
      pointX: point.x,
      pointY: point.y,
    });
  }, []);

  const renderCustomShape = useCallback((props) => {
    const { cx, cy, payload, z } = props;
    if (cx == null || cy == null) return null;
    
    const radius = z / 2;
    const pointId = payload.id;
    const isDragged = draggedPoint === pointId;
    
    const point = points.find(p => p.id === pointId);
    if (!point) return null;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={isDragged ? '#764ba2' : '#667eea'}
        stroke="#fff"
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleBubbleMouseDown(e, point);
        }}
      />
    );
  }, [draggedPoint, points, handleBubbleMouseDown]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles['custom-tooltip']}>
          <p className={styles['tooltip-label']}>{data.name}</p>
          <p className={styles['tooltip-value']}>
            Stations: {data.x}, Length: {data.y} km
          </p>
          <p className={styles['tooltip-value']}>
            Ridership: {data.size} bn/year
          </p>
        </div>
      );
    }
    return null;
  };

  const scatterData = points.map((point) => ({
    ...point,
    z: getBubbleSize(point.size),
  }));

  const currentRange = useMemo(() => {
    const yValues = points.map(p => p.y);
    if (yValues.length === 0) return { min: 0, max: 0, range: 0 };
    const min = Math.min(...yValues);
    const max = Math.max(...yValues);
    return {
      min: Math.round(min),
      max: Math.round(max),
      range: Math.round(max - min)
    };
  }, [points]);

  return (
    <div className={styles['bubble-graph-container']}>
      <h3 className={styles['graph-title']}>{graphData.title}</h3>
      
      <div className={styles['live-range-display']}>
        <div className={styles['range-item']}>
          <span className={styles['range-label']}>Min:</span>
          <span className={styles['range-value']}>{currentRange.min}</span>
        </div>
        <div className={styles['range-item']}>
          <span className={styles['range-label']}>Max:</span>
          <span className={styles['range-value']}>{currentRange.max}</span>
        </div>
        <div className={styles['range-item']}>
          <span className={styles['range-label']}>Range:</span>
          <span className={styles['range-value']}>{currentRange.range}</span>
        </div>
      </div>
      
      <div className={styles['graph-content']}>
        <div
          ref={containerRef}
          className={styles['chart-wrapper']}
          style={{ cursor: draggedPoint ? 'grabbing' : 'default' }}
        >
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name={graphData.xAxis.label}
                domain={[graphData.xAxis.min, graphData.xAxis.max]}
                ticks={Array.from(
                  { length: (graphData.xAxis.max - graphData.xAxis.min) / graphData.xAxis.step + 1 },
                  (_, i) => graphData.xAxis.min + i * graphData.xAxis.step
                )}
                label={{ value: graphData.xAxis.label, position: 'insideBottom', offset: -10 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={graphData.yAxis.label}
                domain={[graphData.yAxis.min, graphData.yAxis.max]}
                ticks={Array.from(
                  { length: (graphData.yAxis.max - graphData.yAxis.min) / graphData.yAxis.step + 1 },
                  (_, i) => graphData.yAxis.min + i * graphData.yAxis.step
                )}
                label={{ value: graphData.yAxis.label, angle: -90, position: 'insideLeft' }}
              />
              <ZAxis
                type="number"
                dataKey="z"
                name={graphData.bubbleSize.label}
                range={[20, 70]}
                domain={[20, 70]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={currentRange.min}
                stroke="#ff6b6b"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: `Min: ${currentRange.min}`, position: "right" }}
              />
              <ReferenceLine
                y={currentRange.max}
                stroke="#51cf66"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: `Max: ${currentRange.max}`, position: "right" }}
              />
              <Scatter
                name="Cities"
                data={scatterData}
                fill="#667eea"
                cursor="pointer"
                shape={renderCustomShape}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.legend}>
          <h4>{graphData.bubbleSize.label}</h4>
          <div className={styles['legend-items']}>
            {graphData.bubbleSize.values.map((value, index) => (
              <div key={index} className={styles['legend-item']}>
                <div
                  className={styles['legend-bubble']}
                  style={{ width: getBubbleSize(value), height: getBubbleSize(value) }}
                />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles['graph-instructions']}>
        <p>💡 Click and drag the bubbles to move them. Adjust the y-axis positions to change the range.</p>
      </div>
    </div>
  );
}

export default BubbleGraph;
