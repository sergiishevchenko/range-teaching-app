import random

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .challenges import CHALLENGE_TYPES
from .graph_data import GRAPH_POINTS, GRAPH_CONFIG


@api_view(['GET'])
def get_initial_data(request):
    """Return initial graph data based on the Metro Systems example."""
    try:
        data = {
            **GRAPH_CONFIG,
            "points": GRAPH_POINTS
        }
        return Response(data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_challenge(request):
    """Generate a random challenge for the user."""
    try:
        challenge = random.choice(CHALLENGE_TYPES)
        return Response(challenge)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def validate_range(request):
    """Validate if the user's graph meets the challenge requirements."""

    points = request.data.get('points', [])
    challenge = request.data.get('challenge', {})
    
    if not points or not challenge:
        return Response(
            {"error": "Missing points or challenge data"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    y_values = [point['y'] for point in points if 'y' in point]
    if not y_values:
        return Response(
            {"error": "No y-values found in points"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    current_min = min(y_values)
    current_max = max(y_values)
    current_range = current_max - current_min
    
    challenge_type = challenge.get('type')
    is_correct = False
    feedback = ""
    
    if challenge_type == "less_than":
        target = challenge.get('value', 400)
        is_correct = current_range < target
        feedback = f"Your range is {current_range:.0f}. Target: less than {target}. {'✓ Correct!' if is_correct else '✗ Try again!'}"
    
    elif challenge_type == "greater_than":
        target = challenge.get('value', 200)
        is_correct = current_range > target
        feedback = f"Your range is {current_range:.0f}. Target: greater than {target}. {'✓ Correct!' if is_correct else '✗ Try again!'}"
    
    elif challenge_type == "between":
        min_val = challenge.get('min', 100)
        max_val = challenge.get('max', 500)
        is_correct = min_val <= current_range <= max_val
        feedback = f"Your range is {current_range:.0f}. Target: between {min_val} and {max_val}. {'✓ Correct!' if is_correct else '✗ Try again!'}"
    
    elif challenge_type == "exact":
        min_val = challenge.get('min', 150)
        max_val = challenge.get('max', 400)
        is_correct = abs(current_min - min_val) < 10 and abs(current_max - max_val) < 10
        feedback = f"Your range is from {current_min:.0f} to {current_max:.0f}. Target: from {min_val} to {max_val}. {'✓ Correct!' if is_correct else '✗ Try again!'}"
    
    return Response({
        "is_correct": is_correct,
        "feedback": feedback,
        "current_range": {
            "min": current_min,
            "max": current_max,
            "range": current_range
        }
    })
