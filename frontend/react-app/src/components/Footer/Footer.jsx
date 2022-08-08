import './Footer.css';
import nearLogo2 from '../../assets/near-logo2.png';
import face from '../../assets/facebook.png';
import insta from '../../assets/insta.png';
import twitter from '../../assets/twitter.png';
import linkedin from '../../assets/linkedin.png';

export default function Footer(){
    return(
        <footer id="Footer">
        <section>
        <a href="/"><img id="footer-logo" src={nearLogo2} alt="logo do site"/></a>
        
        <p id="fale-conosco">Fale conosco</p>
        <address>
            <a href="mailto:near.suporte@near.com" id="contato-email"><p>near.suporte@near.com</p></a>
            <p>Fone: 0800 2022 040</p>
            <p>R. Imperial, 201 - Recife PE CEP: 51-222-100</p>
        </address>
    </section>
        
    <section id="redes-sociais">
        <p>Redes Sociais</p>
       <a href="/"><img class="img-redes" src={face} alt="logo do facebook"/>
            <strong>Facebook</strong>
        </a>
       <a href="/"><img class="img-redes" src={insta} alt="logo do instagram"/>
            <strong>Instagram</strong>
        </a>
       <a href="/"><img class="img-redes" src={twitter} alt="logo do twitter"/>
            <strong>Twitter</strong>
        </a>
       <a href="/"><img class="img-redes" src={linkedin} alt="logo do linkedIn"/>
            <strong>LinkedIn</strong>    
        </a>

    </section>


    <section>
        <a href="/" ><p>Quem somos?</p></a>
        <a href="/" ><p>História</p></a>
        <a href="/" ><p>Missão e valores</p></a>
        <a href="/" ><p>Nossa equipe</p></a>
    </section>

    <section>
        <a href="/" ><p>Termos e condições</p></a>
        <a href="/" ><p>Politica de privacidade</p></a>
        <a href="/" ><p>Condições de uso</p></a>
        <a href="/" ><p>Politica de privacidade</p></a>
        <a href="/" ><p>Cookies</p></a>
    </section>

    </footer>
    )
}