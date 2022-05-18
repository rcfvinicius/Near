const curso = window.location.href.split('?')[1] ?? 'err';

const div = document.querySelectorAll('main > section:first-child > div')[0];
/* 
div.innerHTML = `
<h1>${curso}</h1>
`; */