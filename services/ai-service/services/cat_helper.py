def calculate_probability(theta: float, a: float, b: float, c: float) -> float:
    import math

    logistic = 1 / (1 + math.exp(-1.702 * a * (theta - b)))
    return c + (1 - c) * logistic
