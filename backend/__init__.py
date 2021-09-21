import os
import base64
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

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
        print(file)
        file.save(os.path.join(UPLOAD_FOLDER, file.filename))
        return "Image uploaded"

@app.route('/fetch-image', methods=['GET'])
def fetch():
    if request.method == 'GET':
        image_list = []
        #Iterate through the images list
        for image_path in os.listdir(UPLOAD_FOLDER):
            with open(UPLOAD_FOLDER + image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read())
            image_list.append(encoded_string.decode('utf-8'))
        return {
            "images": image_list
            }

if __name__ == '__main__':
    app.run()
