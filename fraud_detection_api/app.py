from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)  # allows the frontend to call this API


from flask import send_from_directory

@app.route('/dashboard')
def dashboard():
    return send_from_directory('static', 'index.html')



# ── Load model and feature columns once at startup ──
model = joblib.load('fraud_model.joblib')

with open('feature_columns.json', 'r') as f:
    feature_columns = json.load(f)

print(f" Model loaded successfully")
print(f" Expecting {len(feature_columns)} features")


def engineer_features(data: dict) -> pd.DataFrame:
    """
    Replicates the exact feature engineering from Phase 2.
    Takes raw transaction fields and returns a model-ready DataFrame.
    """
    # One-hot encode transaction type
    transaction_types = ['CASH_IN', 'CASH_OUT', 'DEBIT', 'PAYMENT', 'TRANSFER']
    for t in transaction_types:
        data[f'type_{t}'] = 1 if data.get('type') == t else 0

    # Engineered features
    data['balance_delta_orig'] = (
        data['oldbalanceOrg'] - data['newbalanceOrig']
    )
    data['balance_delta_dest'] = (
        data['newbalanceDest'] - data['oldbalanceDest']
    )
    data['zero_balance_flag'] = (
        1 if data['newbalanceOrig'] == 0 else 0
    )
    data['amount_to_balance_ratio'] = (
        data['amount'] / (data['oldbalanceOrg'] + 1)
    )

    # Remove raw 'type' field — model doesn't use it directly
    data.pop('type', None)

    # Build DataFrame with exact column order the model expects
    df = pd.DataFrame([data])
    df = df.reindex(columns=feature_columns, fill_value=0)

    return df


@app.route('/', methods=['GET'])
def health():
    return jsonify({
        'status': 'running',
        'model': 'Random Forest Fraud Detector',
        'features': len(feature_columns)
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Accepts a transaction JSON and returns fraud prediction.

    Expected JSON body:
    {
        "step": 1,
        "type": "TRANSFER",
        "amount": 1000000,
        "oldbalanceOrg": 1000000,
        "newbalanceOrig": 0,
        "oldbalanceDest": 0,
        "newbalanceDest": 1000000
    }
    """
    try:
        # Parse incoming JSON
        transaction = request.get_json()
        if not transaction:
            return jsonify({'error': 'No JSON body provided'}), 400

        # Validate required fields
        required = ['step', 'type', 'amount', 'oldbalanceOrg',
                    'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest']
        missing = [f for f in required if f not in transaction]
        if missing:
            return jsonify({'error': f'Missing fields: {missing}'}), 400

        # Engineer features
        df = engineer_features(transaction.copy())

        # Get prediction and probability
        prediction = int(model.predict(df)[0])
        probability = float(model.predict_proba(df)[0][1])

        # Build response
        response = {
            'prediction': prediction,
            'label': 'FRAUD' if prediction == 1 else 'LEGITIMATE',
            'fraud_probability': round(probability, 6),
            'risk_level': (
                'HIGH'   if probability >= 0.7 else
                'MEDIUM' if probability >= 0.3 else
                'LOW'
            ),
            'transaction_summary': {
                'type': transaction.get('type'),
                'amount': transaction.get('amount'),
                'balance_delta': transaction.get('oldbalanceOrg', 0) - transaction.get('newbalanceOrig', 0)
            }
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Accepts a list of transactions and returns predictions for all.

    Expected JSON body:
    {
        "transactions": [ {...}, {...}, ... ]
    }
    """
    try:
        body = request.get_json()
        transactions = body.get('transactions', [])

        if not transactions:
            return jsonify({'error': 'No transactions provided'}), 400

        results = []
        for txn in transactions:
            df = engineer_features(txn.copy())
            pred = int(model.predict(df)[0])
            prob = float(model.predict_proba(df)[0][1])
            results.append({
                'prediction': pred,
                'label': 'FRAUD' if pred == 1 else 'LEGITIMATE',
                'fraud_probability': round(prob, 6),
                'risk_level': (
                    'HIGH'   if prob >= 0.7 else
                    'MEDIUM' if prob >= 0.3 else
                    'LOW'
                )
            })

        fraud_count = sum(1 for r in results if r['prediction'] == 1)

        return jsonify({
            'total_transactions': len(results),
            'fraud_detected': fraud_count,
            'legitimate': len(results) - fraud_count,
            'results': results
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)