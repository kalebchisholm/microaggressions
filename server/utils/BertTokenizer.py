"""
CITATION: 
Build a BERT Sci-kit Transformer
Nicolas Bertagnolli, March 19, 2020
https://towardsdatascience.com/build-a-bert-sci-kit-transformer-59d60ddd54a5
"""

import numpy as np
import pandas as pd
import torch
import transformers as ppb # pytorch transformers
import swifter

class BertTokenizer(object):
  def __init__(self):
    # For Bert Tokenizer:
    self.model_class, self.tokenizer_class, self.pretrained_weights = (ppb.BertModel, ppb.BertTokenizer, 'bert-base-uncased')

    # Load pretrained model/tokenizer
    self.tokenizer = self.tokenizer_class.from_pretrained(self.pretrained_weights)

    self.model = self.model_class.from_pretrained(self.pretrained_weights)

  def tokenize(self, text=[]):
    df = pd.DataFrame(data={"text":text})
    tokenized = df["text"].swifter.apply((lambda x: self.tokenizer.encode(x, add_special_tokens=True)))

    max_len = 0
    for i in tokenized.values:
      if len(i) > max_len:
        max_len = len(i)

    padded = np.array([i + [0]*(max_len-len(i)) for i in tokenized.values])

    attention_mask = np.where(padded != 0, 1, 0)
    input_ids = torch.tensor(padded)
    attention_mask = torch.tensor(attention_mask)

    with torch.no_grad(): 
      last_hidden_states = self.model(input_ids, attention_mask=attention_mask)

    features = last_hidden_states[0][:, 0, :].numpy()
    return features
