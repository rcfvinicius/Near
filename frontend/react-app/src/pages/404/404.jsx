import './404.css';
import Header from '../../components/Header/Header.jsx';
import { useEffect } from 'react';
import img from '../../assets/404.png';

export default function NotFound(){
    useEffect(()=>{
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },[])
    return(
        <>
        <Header/>
        <main id='NotFound'>
            <img src={img} alt="https://storyset.com/web"></img>
        </main>
        </>
    )
}