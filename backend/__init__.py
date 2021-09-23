import os
import base64, datetime
from flask import Flask, request
from flask_cors import CORS, cross_origin
import mysql.connector
from config import PASSWORD_

app = Flask(__name__)
cors = CORS(app)

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
        image_list = []
        for path in image_path:
            with open(path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read())
            image_list.append(encoded_string.decode('utf-8'))
        return {
            "images": image_list
        }

if __name__ == '__main__':
    app.run()
