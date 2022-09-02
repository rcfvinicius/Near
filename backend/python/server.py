from flask import Flask, render_template, request, flash, Response, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:0000@localhost/flask'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

CORS(app, resources={r"*": {"origins": "*"}})
###
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    senha = db.Column(db.String(400), nullable=False)
    role = db.Column(db.String(10), nullable=False)

    def __init__(self, nome, email, senha, role):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.role = role
###
@app.route('/login', methods=['POST'])
def login():
    try:
        user = Usuario.query.filter_by(email=request.form['email']).first()
        #print(check_password_hash(user.senha, request.form['senha']))
        if check_password_hash(user.senha, request.form['senha']):
            return jsonify(f'logado em {user.email}'),200
        return jsonify('Usuário ou senha incorretos'),401
    except:
        return jsonify('Usuário ou senha incorretos'),401


@app.route('/cadastro', methods=['POST'])
def cadastro():
    nome = request.get_json()['nome']
    email = request.get_json()["email"]
    senha = request.get_json()["senha"]
    role = request.get_json()["role"]

    hash_senha = generate_password_hash(senha, method='sha256')

    entry = Usuario(nome, email, hash_senha, role)
    try:##
        db.session.add(entry)
        db.session.commit()
        return jsonify('Criado!'),200
    except:
        return jsonify('Usuário ou senha incorretos'),401


@app.route('/delete', methods=['DELETE'])
def delete():
    try:
        email = request.form["email"]
        user = Usuario.query.filter_by(email=email).first()

        db.session.delete(user)
        db.session.commit()
        return jsonify('Usuário deletado'),200
    except:
        return jsonify('Usuário não encontrado'),404


@app.route('/update', methods=['PUT'])
def update():
    try:
        user = Usuario.query.filter_by(email=request.form["email"]).first()

        user.nome = request.form["nome"]
        user.senha = generate_password_hash(request.form["senha"], method='sha256')
        user.role = request.form["role"]

        db.session.commit()
        return jsonify('Usuário alterado!'),200
    except:
        return jsonify('Usuário não encontrado'),404



if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

