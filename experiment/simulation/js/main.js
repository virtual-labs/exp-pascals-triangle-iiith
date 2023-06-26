//Your JavaScript goes in here
document.body.setAttribute("class","gridBody");
let controlsDiv = document.getElementsByClassName('column is-2-desktop is-12-tablet is-12-mobile')[0];
controlsDiv.style.width = 'auto';
//controlsDiv.classList.add("widthAuto");

let n;
let k;
document.getElementById('button2').style.visibility = 'hidden';
function next(){

    n = document.getElementById("n").value;
    let copyN = n;
    n = Number(n);
    const isInteger = Number.isInteger(n);

if(copyN && isInteger && n>=0 && n<4){
const label = document.createElement("label");
const node = document.createTextNode("enter k");
label.appendChild(node);
const input2 = document.createElement("input");
input2.setAttribute("id","input2");
input2.setAttribute("type","number");
input2.setAttribute("max",n);
input2.setAttribute("min","0");
const element = document.getElementById("controls");
element.innerHTML="";
element.appendChild(label);
element.appendChild(input2);

document.getElementById('button1').style.visibility = 'hidden';
document.getElementById('button2').style.visibility = 'visible';
document.getElementById('n').disabled = true;   
document.getElementById('errorId').innerHTML = "";         
}
else{
    document.getElementById('errorId').innerHTML = "n should be an integer between 0 and 3";
}}
function Generate()
{
    const alreadySelected = document.querySelector('.selection');
    if (alreadySelected) {
        alreadySelected.classList.remove('selection');
    }
    let k = document.getElementById("input2").value;
    let copyk = k;
    k = Number(k);
    const isIntegerk = Number.isInteger(n);
    if(copyk && isIntegerk && k>=0 && k<=n){
    console.log({ n, k })
    let selection = document.getElementById(`n${n}${k}`);
    selection.setAttribute("class","selection");
    const image1 = document.getElementById('output');
    image1.src=`images/${n}.jpg`;
    const image2 = document.getElementById('output2');
    image2.src=`images/${n}${k}.jpg`;
    image1.setAttribute("class","image1");
    image2.setAttribute("class","image2");
    document.getElementById('errorId').innerHTML = "";
    }
    else{
        document.getElementById('errorId').innerHTML = "k should be an integer between 0 and n"
    }
    // document.getElementById("output").appendChild(image);
};
function reload(){
window.location.reload();
}
/*
{
    const image='<img src=images/sample.jpg></img>';
    document.getElementById("output").insertAdjacentHTML("beforeend",image);
};*/