def generate_explanation(predicted_price):

    if predicted_price > 35:
        return (
            "📈 Prices are rising due to high demand and limited supply. "
            "Selling now can maximize profit."
        )

    elif predicted_price > 25:
        return (
            "⚖️ Market is stable. You can sell now or wait for slight gains."
        )

    else:
        return (
            "📉 Prices are low due to oversupply. Waiting is recommended."
        )