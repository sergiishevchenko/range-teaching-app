"""
Graph data.
I got it on the Metro Systems of the World example.
"""

GRAPH_POINTS = [
    {"id": 1, "name": "Delhi", "x": 150, "y": 180, "size": 1.5},
    {"id": 2, "name": "Tokyo", "x": 190, "y": 200, "size": 2.5},
    {"id": 3, "name": "Guangzhou", "x": 150, "y": 240, "size": 2.5},
    {"id": 4, "name": "Mexico City", "x": 210, "y": 220, "size": 2.5},
    {"id": 5, "name": "Paris", "x": 300, "y": 260, "size": 1.5},
    {"id": 6, "name": "Seoul", "x": 290, "y": 310, "size": 2.5},
    {"id": 7, "name": "Moscow", "x": 240, "y": 330, "size": 2.5},
    {"id": 8, "name": "London", "x": 270, "y": 400, "size": 2.5},
    {"id": 9, "name": "Beijing", "x": 320, "y": 520, "size": 3.5},
    {"id": 10, "name": "Shanghai", "x": 370, "y": 550, "size": 3.5},
    {"id": 11, "name": "New York City", "x": 420, "y": 320, "size": 3.5},
]

GRAPH_CONFIG = {
    "title": "Metro Systems of the World",
    "xAxis": {
        "label": "Number of Stations",
        "min": 100,
        "max": 450,
        "step": 50
    },
    "yAxis": {
        "label": "Total System Length (km)",
        "min": 150,
        "max": 600,
        "step": 50
    },
    "bubbleSize": {
        "label": "Ridership (bn per year)",
        "values": [1.5, 2.5, 3.5]
    }
}
