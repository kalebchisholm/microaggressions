from flask import Flask
from flask import request
import joblib
import re
import tensorflow as tf
from transformers import TFRobertaModel
from flask_cors import CORS, cross_origin
from flask import jsonify
from utils.BertTokenizer import BertTokenizer
import numpy as np
import warnings
warnings.filterwarnings("ignore")

from transformers import RobertaTokenizer, TFRobertaModel

# Setup Flask application with configured CORS headers
app = Flask(__name__)
cors = CORS(app, origins="*", supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

# Unpickle ML models and Vectorizer, setup a BERT Tokenizer
BINARY_VECTORIZER = joblib.load('utils/binary_cv_vectorizer.pkl')
BERT_TOKENIZER = BertTokenizer()


CV_BINARY_SVC_MODEL = joblib.load('models/binary_CV_poly_SVC.pkl')
BERT_BINARY_POLY_SVC_MODEL = joblib.load('models/binary_bert_poly(hyper).pkl')


MULTICLASS_MODEL = joblib.load('models/multi_hyper_CNB.pkl')


with tf.keras.utils.custom_object_scope({'TFRobertaModel': TFRobertaModel}):
    # Load or create your Keras model here
    MULTICLASS_MODEL_Roberta = tf.keras.models.load_model('models/roberta_92.h5')


# Configure singular route for POST requests from front-end
@app.route("/", methods=['POST','GET'])
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

  if model == 'cv+poly_svm+roberta':
    phrase1 = remove_quotes(phrase)
    phrase2=youre_to_you_are(phrase1)
    modified_phrase = BINARY_VECTORIZER.transform([phrase2]).toarray()    
    current_model = CV_BINARY_SVC_MODEL
    ans_cv = current_model.predict(modified_phrase)[0]
    if ans_cv == 1:
      return True
    return False

  if model == 'bert+rfc+roberta':
    modified_phrase = BERT_TOKENIZER.tokenize(text=[phrase])    
    current_model = joblib.load('models/binary_bert_RFC.pkl')
    ans_bert = current_model.predict(modified_phrase)[0]
    if ans_bert == 0:
      return True
    return False
    
  if model == 'bert+poly_svm+roberta':
    modified_phrase = BERT_TOKENIZER.tokenize(text=[phrase])
    current_model = joblib.load('models/binary_bert_poly(hyper).pkl')
    ans_bert = current_model.predict(modified_phrase)[0]
    if ans_bert == 0:
      return True
    return False
    
  # elif model == 'bert+KNN':
  #   modified_phrase = BERT_TOKENIZER.tokenize(text=[phrase])
  #   current_model = joblib.load('models1/binary_bert_KNN.pkl')
  # elif model == 'cv+poly_svm':
  #   modified_phrase = BERT_TOKENIZER.tokenize(text=[phrase])
  #   current_model = joblib.load('models1/binary_CV_poly_SVC.pkl') 
  
def youre_to_you_are(phrase):
  return re.sub(r"[yY]ou'?re", "you are", phrase)
def remove_quotes(phrase):
  return phrase.replace('"', '')
  
# def Roberta_pred(phrase):
MAX_LEN = 256
def roberta_encode(texts, tokenizer):

    ct = len(texts)
    input_ids = np.ones((ct, MAX_LEN), dtype='int32')
    attention_mask = np.zeros((ct, MAX_LEN), dtype='int32')
    token_type_ids = np.zeros((ct, MAX_LEN), dtype='int32') # Not used in text classification

    for k, text in enumerate(texts):
        # Tokenize
        tok_text = tokenizer.tokenize(text)

        # Truncate and convert tokens to numerical IDs
        enc_text = tokenizer.convert_tokens_to_ids(tok_text[:(MAX_LEN-2)])

        input_length = len(enc_text) + 2
        input_length = input_length if input_length < MAX_LEN else MAX_LEN

        # Add tokens [CLS] and [SEP] at the beginning and the end
        input_ids[k,:input_length] = np.asarray([0] + enc_text + [2], dtype='int32')

        # Set to 1s in the attention input
        attention_mask[k,:input_length] = 1

    return {
        'input_word_ids': input_ids,
        'input_mask': attention_mask,
        'input_type_ids': token_type_ids
    }
def getMAType(phrase):
  """
  Determines the type of microaggression of a given phrase
  :param phrase: the phrase to run through the model
  :return: the type of microaggression
  """
  display_labels = [
    "Age",
    "Body",
    "Disability",
    "Gender ",
    "LGBTQ+",
    "Race",
    "Religion"
  ]
  category_to_name = {0: 'Age',
                      1: 'Body',
                      2: 'Disability',
                      3: 'Gender',
                      4: 'LGBTQ+',
                      5: 'Race',
                      6: 'Religion'}
  

  # phrase=phrase.remove_quotes(phrase)
  # new_phrase = phrase.strip(".\" ")
  new_phrase = phrase.translate({ord("\""):None})
  # new_phrase = phrase.translate(str.maketrans('"', ' '))
  print(new_phrase)
  tokenized_phrase = BERT_TOKENIZER.tokenize(text=[new_phrase])  
  # return display_labels[MULTICLASS_MODEL.predict(tokenized_phrase)[0]].strip()
  tokenizer = RobertaTokenizer.from_pretrained('roberta-base')
  bert_phrase = roberta_encode([new_phrase], tokenizer)
  return category_to_name[np.argmax(MULTICLASS_MODEL_Roberta.predict(bert_phrase))]



# Start app
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080, debug=True)
