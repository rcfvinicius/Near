from flask import Flask, render_template, request, flash, Response
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
    senha = db.Column(db.String(100), nullable=False)
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
        print(check_password_hash(user.senha, request.form['senha']))
        if check_password_hash(user.senha, request.form['senha']):
            return f'logado em {user.email}'
        return 'Usuário ou senha incorretos'
    except:
        return 'Usuário ou senha incorretos'


@app.route('/cadastro', methods=['POST'])
def cadastro():
    nome = request.get_json()['nome']
    email = request.get_json()["email"]
    senha = request.get_json()["senha"]
    role = request.get_json()["role"]

    hash_senha = generate_password_hash(senha, method='sha256')

    entry = Usuario(nome, email, hash_senha, role)
    try:
        db.session.add(entry)
        db.session.commit()
        return 'ok'
    except:
        return 'err'


@app.route('/delete', methods=['DELETE'])
def delete():
    try:
        email = request.form["email"]
        user = Usuario.query.filter_by(email=email).first()

        db.session.delete(user)
        db.session.commit()
        return 'deletado'
    except:
        return 'Usuário não encontrado'


@app.route('/update', methods=['PUT'])
def update():
    try:
        user = Usuario.query.filter_by(email=request.form["email"]).first()

        user.nome = request.form["nome"]
        user.senha = generate_password_hash(request.form["senha"], method='sha256')
        user.role = request.form["role"]

        db.session.commit()
        return 'alterado'
    except:
        return 'Usuário não encontrado'




if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

