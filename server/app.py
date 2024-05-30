import warnings
from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model
import joblib
from utils import *
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])

def analyze():
    # Get data from request body
    data = request.get_json()  # Nếu dữ liệu là JSON
    review = str(data['review'])
    review = process_data(review)
    
    # using model to predict
    model_type = data['type']
    predictions = ''
    if model_type == 'naivebayes' or model_type == 'maxent':
        # Load the vectorizer vocabulary and configuration
        vectorizer = joblib.load("./vectors/tfidf_vector.pkl")
        if model_type == 'naivebayes':
            # Load the pre-trained model
            model = joblib.load('./models/Naive_Bayes_model.pkl')
            # Vectorize your input text
            input_text = [review]
            tfidf_vectors = vectorizer.transform(input_text)
            # Make predictions using the loaded model
            predictions = model.predict(tfidf_vectors)[0]
        else:
            # Load the pre-trained model
            model = joblib.load('./models/logistic_regression_model.pkl')
            # Vectorize your input text
            input_text = [review]
            tfidf_vectors = vectorizer.transform(input_text)
            # Make predictions using the loaded model   
            predictions = model.predict(tfidf_vectors)[0]
    if model_type == 'ann':
        model_dl = load_model("./models/ANN.h5")
        vectorized_text = vectorize_text(review)
        vectorized_text = np.reshape(vectorized_text, (1, 1, 100))
        sentiment_predict = model_dl(vectorized_text)
        sentiment_predict = sentiment_predict.numpy()[0, 0]
        if sentiment_predict > 0.5:
            predictions = 'positive'
        else:
            predictions = 'negative'
    return jsonify({
        "review": predictions
    })

if __name__ == '__main__':
    # Run the app in debug mode
    app.run(debug=True)

 