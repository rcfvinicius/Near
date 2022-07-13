module.exports = function(err,req,res){
    console.log(err);

    //login
    if(err == 'Error: USER_DONT_MATCH'){//email
        res.status(400).send('Email ou senha inválidos');
        return;
    }
    if(err == 'Error: PASSWORD_IS_UNDEFINED'){
        res.status(400).send('Bad request');
        return;
    }

    //cadastro
    if(err._message){//erro no banco
        if(err._message == 'User validation failed'){//dados incorretos
            res.status(400).send('Alguns dados inseridos são inválidos');
            return;
        }
        //outros erros de banco
        res.status(400).send('Erro na criação do usuário');
        return;
    }
    if(err == 'Error: PASSWORD_IS_UNDEFINED'){//erro na senha
        res.status(400).send('Senha precisa ser passada');
        return;
    }
    if(err.code == 11000){
        res.status(400).send('Email duplicado');
        return;
    }

    //delete & update
    if(err == 'Error: USER_NOT_FOUND'){//email
        res.status(404).send('Usuário não encontrado');
        return;
    }

    //jwt
    if(err == 'Error: TOKEN_VERIFICATION_ERROR'){
        res.status(403).send('Erro de autenticação via token');
        return;
    }
    //genérico
    res.status(500).send('Internal Server Error');
}
    
