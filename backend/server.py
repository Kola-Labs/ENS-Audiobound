# Importing the necessary Libraries
from flask_cors import cross_origin
from flask import Flask, render_template, request
from inference.tts.kola_tts_api import KolaSpeechInfer

app = Flask(__name__,template_folder='./',static_folder="/",static_url_path="/")


@app.route('/', methods=['POST', 'GET'])
@cross_origin()
def homepage():
    if request.method == 'POST' and request.form['speech'] != '':
        text = request.form['speech']
        spk = request.form['voices']
        wav_file = KolaSpeechInfer.example_run(text, spk)
        return render_template('template.html', wav_file=wav_file)
    else:
        return render_template('template.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)