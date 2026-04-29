def generate_explanation(predicted_price):
    if predicted_price > 35:
        return (
            "Prices are rising because demand is strong and supply appears limited. "
            "Selling now can help maximize profit."
        )

    if predicted_price > 25:
        return "The market is stable. You can sell now or wait briefly for small gains."

    return "Prices are low because supply appears high. Waiting is recommended."
