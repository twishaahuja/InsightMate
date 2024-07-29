from flask import Flask
from config import Config
from flask_cors import CORS
from routes import bp as routes_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)
    app.register_blueprint(routes_bp)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
