from flask import Flask
from flask import request
import joblib
from flask_cors import CORS, cross_origin
from flask import jsonify
from utils.BertTokenizer import BertTokenizer

app = Flask(__name__)
cors = CORS(app, origins="*", supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

BINARY_VECTORIZER = joblib.load('utils/finalized_vectorizer_binary_model.pkl')
MULTICLASS_TOKENIZER = BertTokenizer()

BINARY_SVC_MODEL = joblib.load('models/finalized_binary_microaggression_model_svc.pkl')
MULTICLASS_MODEL = joblib.load('models/finalized_multiclass_microaggression_model_svc.pkl')

@app.route("/", methods=['POST'])
@cross_origin(supports_credentials=True)
def post():
  data = request.get_json()

  is_microaggression = getInitialMAClassification(data.get('phrase'))

  if is_microaggression:
    microaggression_type = getMAType(data.get('phrase'))
  else:
    microaggression_type = ""

  return jsonify({
    'is_microaggression': is_microaggression,
    'microaggression_type': microaggression_type
  })

def getInitialMAClassification(phrase):
  vectorized_phrase = BINARY_VECTORIZER.transform([phrase])
  vectorized_phrase_nd = vectorized_phrase.toarray()
  if BINARY_SVC_MODEL.predict(vectorized_phrase_nd)[0] == 'microaggression':
    return True
  return False

def getMAType(phrase):
  display_labels = [
    "age",
    "body",
    "disability",
    "gender ",
    "lgbtq+",
    "racial"
  ]
  tokenized_phrase = MULTICLASS_TOKENIZER.tokenize(text=[phrase])
  return display_labels[MULTICLASS_MODEL.predict(tokenized_phrase)[0]].strip()


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8000, debug=True)
