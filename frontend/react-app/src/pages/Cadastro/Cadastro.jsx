import './Cadastro.css';

export default function Cadastro(){

    return(
        <div id="Cadastro">
        <section>
        <form>
            <h2>cadastro</h2>
            <div class="user-box">
                <label htmlFor="nome"><h5>Nome*</h5></label>
                <input id="nome" type="text" name="nome" placeholder="Nome" required/>
            </div>
            <div class="user-box">
                <label htmlFor="sobrenome"><h5>Sobrenome</h5></label>
                <input id="sobrenome" type="text" name="sobrenome" placeholder="Sobrenome"/>
            </div>
            <div class="user-box">
                <label htmlFor="email"><h5>Email*</h5></label>
                <input id="email" type="email" name="email" placeholder="Email" required/>
            </div>
            <div class="user-box">
                <label htmlFor="senha"><h5>Senha*</h5></label>
                <input id="senha" type="password" name="senha" placeholder="Senha" required/>
            </div>
            <input type="checkbox" value="professor"/>Sou professor
            <input id="submit-btn" value="CRIAR CONTA" type="submit"/>
        </form>
    </section>
    </div>
    )
}