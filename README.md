# AI-Driven Fraud Detection for Mobile Money Transactions

> An intelligent, explainable fraud detection system that leverages Machine Learning
> to identify fraudulent mobile money transactions in real time, explain every
> prediction using SHAP, and provide an interactive web dashboard for monitoring
> and analysis.

**University of Ibadan — Department of Computer Science**
**CSC 476 Research Project | Group 18 | 2026**

---

## Table of Contents

* [Project Overview](#project-overview)
* [Problem Statement](#problem-statement)
* [Objectives](#objectives)
* [Project Features](#project-features)
* [System Architecture](#system-architecture)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Dataset](#dataset)
* [Machine Learning Pipeline](#machine-learning-pipeline)
* [Model Performance](#model-performance)
* [Explainable AI (SHAP)](#explainable-ai-shap)
* [REST API](#rest-api)
* [Frontend Dashboard](#frontend-dashboard)
* [Installation](#installation)
* [Running the Project](#running-the-project)
* [API Endpoints](#api-endpoints)
* [Example Prediction](#example-prediction)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)
* [License](#license)

---

## Project Overview

Mobile money services have transformed financial inclusion across Sub-Saharan
Africa and other developing regions, enabling hundreds of millions of previously
unbanked individuals to participate in the formal economy. However, the rapid
growth of these platforms has simultaneously attracted sophisticated fraudsters,
and existing rule-based detection systems are no longer adequate.

This project presents a complete, end-to-end **AI-driven fraud detection system**
for mobile money transactions, built using the PaySim synthetic dataset. The
system:

- Trains a **Random Forest classifier** on 6.3 million transactions
- Engineers **four domain-specific features** targeting mobile money fraud patterns
- Applies **SHAP (SHapley Additive exPlanations)** to make every prediction
  interpretable and auditable
- Serves predictions through a **Flask REST API** with single and batch endpoints
- Provides a **real-time interactive web dashboard** for transaction analysis

The system achieved near-perfect discrimination between fraudulent and legitimate
transactions, correctly identifying **1,639 of 1,643 fraud cases** while generating
only **9 false alarms** among 1,270,881 legitimate transactions.

---

## Problem Statement

Traditional mobile money fraud detection systems rely on rigid, rule-based
mechanisms that suffer from three fundamental weaknesses:

- They are **reactive** — rules are written only after a fraud pattern is already
  known, leaving novel attacks undetected
- They are **static** — fraudsters quickly learn to operate within rule boundaries,
  rendering the system ineffective
- They are **opaque** — black-box outputs cannot satisfy regulatory requirements
  for explainable automated decisions

Additionally, the extreme class imbalance in transaction data (less than 1%
fraudulent) makes naïve machine learning approaches unreliable. This project
addresses all of these challenges directly.

---

## Objectives

1. Review existing literature on ML-based fraud detection and identify research gaps
2. Engineer discriminative features from mobile money transaction data
3. Design and implement a supervised ML pipeline using the PaySim dataset
4. Train and optimise a Random Forest classifier for binary fraud classification
5. Integrate SHAP to produce explainable, human-readable outputs per prediction
6. Evaluate the system using F1-Score, AUC-ROC, Precision, and Recall
7. Deploy the model through a REST API and interactive web dashboard

---

## Project Features

- ✅ Real-time single and batch fraud prediction
- ✅ Random Forest classifier with class-weighted learning
- ✅ Four domain-engineered features targeting account-draining fraud patterns
- ✅ SHAP global feature importance (bar chart + beeswarm plot)
- ✅ SHAP local explanation per flagged transaction (waterfall plot)
- ✅ Flask REST API with `/predict` and `/predict/batch` endpoints
- ✅ Interactive web dashboard with live transaction history and stats
- ✅ Risk level categorisation (HIGH / MEDIUM / LOW)
- ✅ Fully reproducible pipeline in Google Colab
- ✅ All four target evaluation metrics exceeded

---

## System Architecture

```
Mobile Money Transaction (JSON)
            │
            ▼
   Web Dashboard (HTML/CSS/JS)
            │
            ▼  POST /predict
     Flask REST API (app.py)
            │
            ▼
  Feature Engineering Layer
  (balance_delta_orig, balance_delta_dest,
   zero_balance_flag, amount_to_balance_ratio)
            │
            ▼
  Random Forest Classifier
  (class_weight='balanced', 15 features)
            │
            ▼
  SHAP TreeExplainer
  (local + global explanations)
            │
            ▼
  JSON Response
  (label, fraud_probability, risk_level,
   transaction_summary)
```

---

## Technology Stack

| Category | Tools |
|----------|-------|
| Language | Python 3.12 |
| Machine Learning | scikit-learn 1.6.1, SHAP 0.44+ |
| Data Analysis | pandas, numpy |
| Visualisation | matplotlib, seaborn |
| API Framework | Flask 3.x, Flask-CORS |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Development | Google Colab, VS Code, Git, GitHub |
| Model Persistence | joblib |

---

## Project Structure

```
fraud-detection-mobile-money/
│
├── fraud_detection_pipeline.ipynb  # Full ML pipeline (run in Google Colab)
├── app.py                          # Flask REST API
├── feature_columns.json            # Ordered feature schema for inference
├── fraud_model.joblib              # Trained Random Forest model
├── requirements.txt                # Python dependencies
├── .gitignore
├── README.md
│
├── static/
│   └── index.html                  # Interactive web dashboard
│
└── images/
    ├── class_distribution.png
    ├── transaction_types.png
    ├── amount_distributions.png
    ├── confusion_matrix.png
    ├── roc_curve.png
    ├── shap_global_bar.png
    ├── shap_beeswarm.png
    └── shap_waterfall.png
```

---

## Dataset

The model was trained on the **PaySim** synthetic mobile money dataset created
by Lopez-Rojas, Elmir & Axelsson (2016), simulating M-Pesa transaction logs.

| Property | Value |
|----------|-------|
| Total Records | 6,362,620 transactions |
| Fraudulent Records | 8,213 (0.13%) |
| Legitimate Records | 6,354,407 (99.87%) |
| Class Imbalance Ratio | ~768:1 |
| Transaction Types | CASH-IN, CASH-OUT, DEBIT, PAYMENT, TRANSFER |
| Fraud-Bearing Types | CASH-OUT and TRANSFER only |
| Time Span | 30 days simulated (hourly steps 1–744) |

**Download:** https://www.kaggle.com/datasets/ealaxi/paysim1

> Note: `paysim.csv` is not included in this repository due to its size (~490MB).
> Download it from Kaggle and place it in the project root before running the notebook.

---

## Machine Learning Pipeline

```
1.  Load PaySim CSV (6,362,620 rows × 11 columns)
2.  Exploratory Data Analysis (class distribution, amount stats, type analysis)
3.  Drop irrelevant columns (nameOrig, nameDest, isFlaggedFraud)
4.  One-hot encode transaction type
5.  Engineer four fraud-specific features
6.  Apply class_weight='balanced' to handle 768:1 imbalance
7.  Stratified 80/20 train-test split (seed=42)
8.  GridSearchCV on stratified 10% subsample (5-fold CV, F1 scoring)
9.  Train final Random Forest on full 5,090,096-row training set
10. Generate SHAP global and local explanations
11. Evaluate on 1,272,524-row held-out test set
12. Serialise model to fraud_model.joblib
13. Deploy via Flask API + web dashboard
```

### Engineered Features

| Feature | Formula | Purpose |
|---------|---------|---------|
| `balance_delta_orig` | `oldbalanceOrg − newbalanceOrig` | Detects complete account draining |
| `balance_delta_dest` | `newbalanceDest − oldbalanceDest` | Detects unusual receiver balance spikes |
| `zero_balance_flag` | `1 if newbalanceOrig == 0` | Binary flag for fully drained accounts |
| `amount_to_balance_ratio` | `amount / (oldbalanceOrg + 1)` | Detects when 100% of funds are moved |

---

## Model Performance

Evaluated on a stratified held-out test set of **1,272,524 transactions**:

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| F1-Score | **0.9960** | ≥ 0.85 | ✅ PASSED |
| AUC-ROC | **0.9999** | ≥ 0.90 | ✅ PASSED |
| Precision | **0.9945** | ≥ 0.80 | ✅ PASSED |
| Recall | **0.9976** | ≥ 0.85 | ✅ PASSED |

### Confusion Matrix

| | Predicted: Legitimate | Predicted: Fraud |
|---|---|---|
| **Actual: Legitimate** | 1,270,872 (TN) | 9 (FP) |
| **Actual: Fraud** | 4 (FN) | 1,639 (TP) |

- **Fraud detection rate:** 99.76%
- **False alarm rate:** 0.0007%

![Confusion Matrix](images/confusion_matrix.png)

![ROC Curve](images/roc_curve.png)

---

## Explainable AI (SHAP)

Every fraud prediction is accompanied by a SHAP explanation showing exactly
which features drove the decision and by how much. This directly addresses
regulatory requirements for explainable automated financial decisions.

### Global Feature Importance (Bar Chart)
Shows the average contribution of each feature across all predictions.

![SHAP Global Bar](images/shap_global_bar.png)

### SHAP Beeswarm Plot
Shows both the direction and magnitude of each feature's impact across
all sampled transactions.

![SHAP Beeswarm](images/shap_beeswarm.png)

### SHAP Waterfall Plot (Individual Prediction)
Example: a TRANSFER transaction where ₦1,338,487 was moved and the
sender's account was drained to exactly ₦0.

Top contributing features for this prediction:
- `balance_delta_orig` = 1,338,487 → fraud score **+0.1526**
- `amount_to_balance_ratio` = 1.0000 → fraud score **+0.1124**
- `newbalanceOrig` = 0.0000 → fraud score **+0.0640**

![SHAP Waterfall](images/shap_waterfall.png)

---

## REST API

The Flask API loads the trained model at startup and serves predictions
over HTTP. Feature engineering is applied identically to training inside
the API, ensuring no training-serving skew.

### Request Format

```http
POST /predict
Content-Type: application/json
```

```json
{
  "step": 1,
  "type": "TRANSFER",
  "amount": 1338487,
  "oldbalanceOrg": 1338487,
  "newbalanceOrig": 0,
  "oldbalanceDest": 0,
  "newbalanceDest": 1338487
}
```

### Response Format

```json
{
  "fraud_probability": 0.819057,
  "label": "FRAUD",
  "prediction": 1,
  "risk_level": "HIGH",
  "transaction_summary": {
    "amount": 1338487,
    "balance_delta": 1338487,
    "type": "TRANSFER"
  }
}
```

---

## Frontend Dashboard

The web dashboard provides a complete interface for real-time transaction
analysis without needing to call the API manually.

**Features:**
- Transaction input form with quick-fill fraud/legitimate examples
- Real-time fraud probability bar with risk level badge
- Running stats (total checked, fraud detected, fraud rate)
- Full transaction history with colour-coded FRAUD/LEGIT badges
- Human-readable explanation of why a transaction was flagged

---

## Installation

```bash
# Clone the repository
git clone https://github.com/adelekeemmanuel01/fraud_detection_api.git
cd fraud_detection_api

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Running the Project

### Run the Notebook (Model Training)

1. Open `fraud_detection_pipeline.ipynb` in Google Colab
2. Upload `paysim.csv` to the Colab files panel
   (or load from Google Drive — see notebook instructions)
3. Run all cells from top to bottom
4. Download `fraud_model.joblib` and `feature_columns.json`
   and place them in the project root

### Run the Flask API and Dashboard

```bash
python app.py
```

Open your browser and go to:
```
http://127.0.0.1:5000/dashboard
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check — returns API status |
| POST | `/predict` | Single transaction fraud prediction |
| POST | `/predict/batch` | Batch prediction for multiple transactions |
| GET | `/dashboard` | Serves the interactive web dashboard |

---

## Example Prediction

### Fraud Transaction

| Field | Value |
|-------|-------|
| Type | TRANSFER |
| Amount | ₦1,338,487 |
| Sender Balance Before | ₦1,338,487 |
| Sender Balance After | ₦0 |
| Receiver Balance Before | ₦0 |
| Receiver Balance After | ₦1,338,487 |

**Result:** `FRAUD` | Probability: `81.9%` | Risk: `HIGH`

### Legitimate Transaction

| Field | Value |
|-------|-------|
| Type | PAYMENT |
| Amount | ₦500 |
| Sender Balance Before | ₦50,000 |
| Sender Balance After | ₦49,500 |

**Result:** `LEGITIMATE` | Probability: `0.0%` | Risk: `LOW`

---

## Authors

**Project Title:** AI-Driven Fraud Detection for Mobile Money Transactions

| Name | Student ID |
|------|-----------|
| Ohore Oreva Pauline | 236346 |
| Adeleke Emmanuel Ayoola | 236587 |
| Enoch Oluwadamilare Gold | 236332 |

**Institution:** University of Ibadan
**Department:** Computer Science
**Course:** CSC 476 — Research Project
**Year:** 2026

---

## Acknowledgements

Special thanks to:
- University of Ibadan and the Department of Computer Science
- Our project supervisor for guidance throughout this research
- Lopez-Rojas, Elmir & Axelsson for the PaySim dataset
- The open-source Python and scikit-learn communities

---

## License

This project was developed for academic and research purposes as part of
CSC 476 at the University of Ibadan.

You are free to fork, study, and build upon this work provided that
appropriate credit is given to the authors.
