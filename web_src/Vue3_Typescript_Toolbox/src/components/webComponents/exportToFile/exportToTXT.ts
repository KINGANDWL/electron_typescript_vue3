export function exportToTXT(filename:string, text:string,charset:string="utf-8") {
    var element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=${charset},${text}`);
    element.setAttribute('download', filename);
   
    element.style.display = 'none';
    document.body.appendChild(element);
   
    element.click();
   
    document.body.removeChild(element);
}