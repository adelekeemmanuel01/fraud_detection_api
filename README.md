# AI-Driven Fraud Detection for Mobile Money Transactions

> An intelligent fraud detection system that leverages Machine Learning to identify fraudulent mobile money transactions, explain predictions using SHAP, and provide a user-friendly web dashboard for monitoring and analysis.

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
* [Results](#results)
* [Future Improvements](#future-improvements)
* [Authors](#authors)
* [License](#license)

---

# Project Overview

Mobile money services have transformed digital payments by making financial transactions faster and more accessible. However, the increasing adoption of these services has also led to a rise in fraudulent activities.

This project presents an **AI-driven fraud detection system** capable of identifying suspicious mobile money transactions in real time.

The system consists of:

* A Machine Learning model trained on transaction data
* A Flask REST API for serving predictions
* A modern web dashboard
* Explainable AI using SHAP to interpret predictions

Instead of simply predicting whether a transaction is fraudulent, the system also explains **why** it reached that decision.

---

# Problem Statement

Traditional fraud detection systems often rely on predefined rules.

Examples include:

* Transactions above a certain amount
* Transactions from specific locations
* Transactions occurring at unusual times

Although useful, rule-based systems struggle to detect evolving fraud patterns.

This project addresses that challenge by using Machine Learning to automatically learn fraudulent behavior from historical transaction data.

---

# Objectives

The objectives of this project are:

* Detect fraudulent mobile money transactions
* Minimize false positives
* Provide fast predictions through an API
* Explain predictions using SHAP
* Visualize fraud analytics on a web dashboard
* Demonstrate an end-to-end AI deployment pipeline

---

# Project Features

✅ Fraud prediction

✅ Explainable AI (SHAP)

✅ Random Forest classifier

✅ Flask REST API

✅ Interactive web dashboard

✅ Model evaluation metrics

✅ Feature importance visualization

✅ Real-time transaction prediction

---

# System Architecture

```
                    +--------------------+
                    |   Mobile User      |
                    +--------------------+
                              |
                              |
                              ▼
                     Web Dashboard
                              |
                              ▼
                        Flask REST API
                              |
                              ▼
                  Data Preprocessing Layer
                              |
                              ▼
                 Random Forest ML Model
                              |
                              ▼
               Fraud Prediction + SHAP
                              |
                              ▼
                      Prediction Results
```

---

# Technology Stack

## Programming

* Python

## Machine Learning

* Scikit-learn
* SHAP

## Data Analysis

* Pandas
* NumPy

## Visualization

* Matplotlib
* Seaborn

## Backend

* Flask

## Frontend

* HTML
* CSS
* JavaScript

## Development

* Google Colab
* Jupyter Notebook
* VS Code
* Git
* GitHub

---

# Project Structure

```
fraud-detection-system/

│
├── dataset/
│   └── paysim.csv
│
├── notebook/
│   └── fraud_detection.ipynb
│
├── model/
│   ├── random_forest.pkl
│   ├── scaler.pkl
│   └── label_encoder.pkl
│
├── backend/
│   ├── app.py
│   ├── routes.py
│   └── utils.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── images/
│
├── requirements.txt
│
└── README.md
```

---

# Dataset

The model was trained using the **PaySim** dataset.

The dataset simulates mobile money transactions based on real financial transaction patterns.

Typical features include:

* Transaction Type
* Transaction Amount
* Sender Balance
* Receiver Balance
* New Sender Balance
* New Receiver Balance
* Fraud Label

---

# Machine Learning Pipeline

The complete workflow consists of:

1. Load dataset
2. Explore the data
3. Clean missing values
4. Encode categorical variables
5. Feature engineering
6. Train-test split
7. Train Random Forest model
8. Hyperparameter tuning
9. Model evaluation
10. SHAP explainability
11. Save trained model
12. Deploy using Flask

---

# Model Performance

Replace the values below with your actual results.

| Metric    | Score  |
| --------- | ------ |
| Accuracy  | XX.XX% |
| Precision | XX.XX% |
| Recall    | XX.XX% |
| F1 Score  | XX.XX% |
| ROC-AUC   | XX.XX% |

---

## Confusion Matrix

> Replace the image below with your own confusion matrix.

```
📷 INSERT IMAGE HERE
images/confusion_matrix.png
```

Example Markdown after adding your image:

```markdown
![Confusion Matrix](images/confusion_matrix.png)
```

---

## ROC Curve

```
📷 INSERT IMAGE HERE
images/roc_curve.png
```

```markdown
![ROC Curve](images/roc_curve.png)
```

---

## Precision-Recall Curve

```
📷 INSERT IMAGE HERE
images/precision_recall_curve.png
```

---

## Feature Importance

```
📷 INSERT IMAGE HERE
images/feature_importance.png
```

---

# Explainable AI (SHAP)

One major goal of this project is to make model predictions interpretable.

Instead of treating the model as a "black box," SHAP explains how each feature contributes to the prediction.

---

## SHAP Summary Plot

```
📷 INSERT IMAGE HERE
images/shap_summary.png
```

---

## SHAP Beeswarm Plot

```
📷 INSERT IMAGE HERE
images/shap_beeswarm.png
```

---

## SHAP Waterfall Plot

```
📷 INSERT IMAGE HERE
images/shap_waterfall.png
```

---

## SHAP Bar Plot

```
📷 INSERT IMAGE HERE
images/shap_bar.png
```

---

## SHAP Force Plot (Optional)

```
📷 INSERT IMAGE HERE
images/shap_force.png
```

---

# REST API

The Flask API exposes the trained model for prediction.

Example request:

```http
POST /predict
```

Example JSON:

```json
{
  "type":"TRANSFER",
  "amount":250000,
  "oldbalanceOrg":500000,
  "newbalanceOrig":250000,
  "oldbalanceDest":10000,
  "newbalanceDest":260000
}
```

Example response:

```json
{
    "prediction":"Fraud",
    "probability":0.98
}
```

---

# Frontend Dashboard

The dashboard provides:

* Transaction prediction
* Fraud probability
* Prediction history
* SHAP explanations
* Interactive charts
* Model insights

---

## Dashboard Screenshot

```
📷 INSERT IMAGE HERE
images/dashboard.png
```

---

## Prediction Page

```
📷 INSERT IMAGE HERE
images/prediction_page.png
```

---

## Analytics Page

```
📷 INSERT IMAGE HERE
images/analytics.png
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fraud-detection-system.git
```

Navigate into the project

```bash
cd fraud-detection-system
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

# Running the Project

Start the Flask server

```bash
python app.py
```

Open your browser

```
http://127.0.0.1:5000
```

---

# API Endpoints

## Home

```
GET /
```

Returns the homepage.

---

## Predict

```
POST /predict
```

Returns fraud prediction.

---

## Health Check

```
GET /health
```

Checks whether the API is running.

---

# Example Prediction

| Feature          |    Value |
| ---------------- | -------: |
| Transaction Type | TRANSFER |
| Amount           |   250000 |
| Sender Balance   |   500000 |
| Receiver Balance |    10000 |

Prediction

```
Fraud
```

Fraud Probability

```
98%
```

---

# Results

The Random Forest model successfully learned transaction patterns and accurately distinguished fraudulent transactions from legitimate ones.

The SHAP explainability framework further enhanced transparency by showing how individual features influenced each prediction, making the system more interpretable and trustworthy.

---

# Future Improvements

Possible enhancements include:

* XGBoost implementation
* LightGBM implementation
* Deep Learning models
* Real-time streaming predictions
* Docker deployment
* Cloud deployment (AWS, Azure, or GCP)
* User authentication
* Database integration
* Live fraud monitoring dashboard
* SMS/Email fraud alerts

---

# Authors

**Project Title**

AI-Driven Fraud Detection for Mobile Money Transactions

Developed by:

* Your Name
* Team Member 2
* Team Member 3
* Team Member 4

Institution:

University of Ibadan

Department of Computer Science

---

# Acknowledgements

Special thanks to:

* University of Ibadan
* Project Supervisor
* PaySim Dataset creators
* The open-source Python community

---

# License

This project was developed for academic and research purposes.

Feel free to fork, study, and improve the project while giving appropriate credit to the authors.
