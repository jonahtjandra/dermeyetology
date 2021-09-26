import os
import sys
from numpy import Infinity
import tensorflow as tf
from tensorflow import keras
import base64, datetime
from flask import Flask, request
from flask_cors import CORS, cross_origin
import mysql.connector
from tensorflow.python.keras.backend import maximum
from config import PASSWORD_

app = Flask(__name__)
cors = CORS(app)

new_model = tf.keras.models.load_model('saved_model/alpha_1')

def getdb():
    cnx = mysql.connector.connect(user='root', password=PASSWORD_,
                              host='localhost',
                              database='dermeyetology')
    return cnx

def dbaddImage(id, imagePath):
    add_image = ("INSERT INTO images "
               "(id, image_path) "
               "VALUES (%s, %s)")
    cnx = getdb()
    try:
        cnx.cursor().execute(add_image, (id, imagePath))
        cnx.commit()
        print("image added to database")
    except Exception as e:
        print("adding image failed")
        print(e)
    cnx.close()

def dbfetchImage(id):
    print(id)
    fetch_image = ("SELECT * FROM images WHERE id = %s")
    cnx = getdb()
    cursor = cnx.cursor(dictionary=True)
    image_path = []
    try:
        cursor.execute(fetch_image, (id,))
        print("image fetched")
        for row in cursor:
            image_path.append(row['image_path'])
        return image_path
    except Exception as e:
        print("fetching image failed")
        print(e)
    cnx.close()

def buildFileName(name):
    curr = datetime.datetime.now()
    return str(curr.year) + str(curr.month) + str(curr.day) + str(curr.hour) + str(curr.minute) + str(curr.second) + name

def getPrediction(image_path):
    pred_list = []
    image_list = []
    for path in image_path:
        img = keras.preprocessing.image.load_img(path, target_size=(128, 128))
        img_array = keras.preprocessing.image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)
        pred_list.append(new_model.predict(img_array))
        with open(path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read())
        image_list.append(encoded_string.decode('utf-8'))
        top_pred_list = []
        for pred in pred_list:
            maximum = -sys.maxsize - 1
            index = 0
            for i in range(pred.size):
               if pred[0][i] > maximum:
                   maximum = pred[0][i]
                   index = i
            if index == 0:
                top_pred_list.append("NONSPECIFIC_acne")
            elif index == 1:
                top_pred_list.append("Perifolliculitis capitis abscedens et suffodiens")
            elif index == 2:
                top_pred_list.append("rhinophym")
            elif index == 3:
                top_pred_list.append("perioral_dermatitis")
            elif index == 4:
                top_pred_list.append("NONSPECIFIC_rosacea")
    return [top_pred_list, image_list]

@app.route('/', methods=['GET'])
def main():
    if request.method == 'GET':
        return "This is the backend!"

# upload constants
UPLOAD_FOLDER = os.getcwd() + '/im-receive/'

@app.route('/upload-image', methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['myImage']
        filePath = os.path.join(UPLOAD_FOLDER, buildFileName(file.filename))
        file.save(filePath)
        dbaddImage(str(request.headers['id']), filePath)
        return "Image uploaded"

@app.route('/fetch-image', methods=['GET'])
def fetch():
    if request.method == 'GET':
        print("request headers: " + request.headers['id'])
        image_path = dbfetchImage(request.headers['id'])
        pred = getPrediction(image_path)
        image_list = pred[1]
        pred_list = pred[0]
        print(pred_list)
        return {
            "images": image_list,
            "prediction": pred_list
        }

if __name__ == '__main__':
    app.run(host='0.0.0.0')
