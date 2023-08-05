# Microaggressions

## ML model to detect microaggressions in conversation
This microaggression detector uses various machine learning models in order to determine\
(1) whether or not the inputted text is a microaggression and\
 (2) what category of microaggression it falls under\
 Currently, the models supports the following 7 categories of microaggressions:\
 `Age`\
 `Body`\
 `Disability`\
 `Gender`\
 `LGBTQ+`\
 `Race`\
 `Religion`


## Download the trained RoBERTa model from the below link:
Due to storage restrictions in GitHub, the model is stored in Google Drive (2GB):
https://drive.google.com/file/d/1X_D0rS-BT-GyBZmlEwAlUl1sZh2M3-iZ/view?usp=sharing

Download the RoBERTa model to  `server/models/`
### To start the client

- Install the dependencies with `npm i`
- Run the application with `npm start`

### To start the server
- `pip install -r requirements.txt`
- `pip install torch==2.0.1+cpu -f https://download.pytorch.org/whl/torch_stable.html`
- Install any other dependencies using `pip`
- Start the server with `python api.py`
