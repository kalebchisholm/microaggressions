from flask import Flask
from flask import request
import joblib
from flask_cors import CORS, cross_origin
from flask import jsonify
from utils.BertTokenizer import BertTokenizer

# Setup Flask application with configured CORS headers
app = Flask(__name__)
cors = CORS(app, origins="*", supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

# Unpickle ML models and Vectorizer, setup a BERT Tokenizer
BINARY_VECTORIZER = joblib.load('utils/cv_finalized_vectorizer_binary_model.pkl')
BERT_TOKENIZER = BertTokenizer()

CV_BINARY_SVC_MODEL = joblib.load('models/cv_finalized_binary_microaggression_model_svc.pkl')
BERT_BINARY_SVC_MODEL = joblib.load('models/bert_finalized_binary_microaggression_model_svc.pkl')

MULTICLASS_MODEL = joblib.load('models/finalized_multiclass_microaggression_model_svc.pkl')

# Configure singular route for POST requests from front-end
@app.route("/", methods=['POST'])
@cross_origin(supports_credentials=True)
def post():
  data = request.get_json()

  # Determine if request phrase is a microaggression or not with the selected model
  is_microaggression = getInitialMAClassification(data.get('phrase'), data.get('model'))

  # Check what category of microaggression it falls under, if it is a microaggression
  if is_microaggression:
    microaggression_type = getMAType(data.get('phrase'))
  else:
    microaggression_type = ""

  return jsonify({
    'is_microaggression': is_microaggression,     # true or false, depending on model #1
    'microaggression_type': microaggression_type  # category of microaggression, depending on model #2
  })

# ------------------------------- HELPER METHODS ------------------------------
def getInitialMAClassification(phrase, model):
  """
  Determines whether or not the inputted phrase is a microaggression or not
  :param phrase: the phrase to run through the model
  :param model: the model to use
  :return: boolean value indicating if it is a microaggression or not
"""
  if model == 'cv':
    modified_phrase = BINARY_VECTORIZER.transform([phrase]).toarray()
    current_model = CV_BINARY_SVC_MODEL
  else:
    modified_phrase = BERT_TOKENIZER.tokenize(text=[phrase])
    current_model = BERT_BINARY_SVC_MODEL

  if current_model.predict(modified_phrase)[0] == 'microaggression':
    return True
  return False

def getMAType(phrase):
  """
  Determines the type of microaggression of a given phrase
  :param phrase: the phrase to run through the model
  :return: the type of microaggression
  """
  display_labels = [
    "age",
    "body",
    "disability",
    "gender ",
    "lgbtq+",
    "racial"
  ]
  tokenized_phrase = BERT_TOKENIZER.tokenize(text=[phrase])
  return display_labels[MULTICLASS_MODEL.predict(tokenized_phrase)[0]].strip()

# Start app
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080, debug=True)
