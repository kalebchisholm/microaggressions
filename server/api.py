from flask import Flask
from flask import request
import joblib
from flask_cors import CORS, cross_origin
from flask import jsonify
from utils.BertTokenizer import BertTokenizer

app = Flask(__name__)
cors = CORS(app, origins="*", supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

BINARY_VECTORIZER = joblib.load('utils/cv_finalized_vectorizer_binary_model.pkl')
BERT_TOKENIZER = BertTokenizer()

CV_BINARY_SVC_MODEL = joblib.load('models/cv_finalized_binary_microaggression_model_svc.pkl')
BERT_BINARY_SVC_MODEL = joblib.load('models/bert_finalized_binary_microaggression_model_svc.pkl')

MULTICLASS_MODEL = joblib.load('models/finalized_multiclass_microaggression_model_svc.pkl')

@app.route("/", methods=['POST'])
@cross_origin(supports_credentials=True)
def post():
  data = request.get_json()

  is_microaggression = getInitialMAClassification(data.get('phrase'), data.get('model'))

  if is_microaggression:
    microaggression_type = getMAType(data.get('phrase'))
  else:
    microaggression_type = ""

  return jsonify({
    'is_microaggression': is_microaggression,
    'microaggression_type': microaggression_type
  })

def getInitialMAClassification(phrase, model):
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


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8000, debug=True)
