//Your JavaScript goes in here
document.body.setAttribute("class","gridBody");
let controlsDiv = document.getElementsByClassName('column is-2-desktop is-12-tablet is-12-mobile')[0];
controlsDiv.style.width = 'auto';
//controlsDiv.classList.add("widthAuto");

let n;
let k;
let n_arr=["the cuboid representing n=0 is just a point as the binomial expansion for n=0 is just 1.","the cuboid representing n=1 is a single line split in two parts with the length a+b","the cuboid representing n=2 is square divided into four parts with the length of a side being a+b","the cuboid representing n=3 is a cube divided into eight parts with the length of a side being a+b"]
let k0=["k=0 for n=0 represents the constant 1 which is just a point"]
let k1=["k=0 for n=1 represents a line with the length a from the binomial expansion term a","k=1 for n=1 represents a line with the length b from the binomial expansion term b"]
let k2=["k=0 for n=2 represents a square with the length of a side equal to a from the binomial expansion term a^2","k=2 for n=2 represents a square with the length of a side equal to b from the binomial expansion term b^2","k=2 for n=2 represents a square with the length of a side equal to b from the binomial expansion term b^2"]
let k3=["k=0 for n=3 represents a^3 from thr binomial expansion in the form of a cube with the length of its side equal to a","k=1 for n=3 represents 3a^2b from thr binomial expansion in the form of three cuboids with the length of its sides equal to a,a and b","k=2 for n=3 represents 3ab^2 from thr binomial expansion in the form of three cuboids with the length of its sides equal to a,b and b","k=3 for n=3 represents b^3 from thr binomial expansion in the form of a cube with the length of its side equal to b"]

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
    document.getElementById('errorId').innerHTML = "\[n\] should be an integer between 0 and 3";
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
    document.getElementById("n_desc").innerHTML=n_arr[n];
    const image2 = document.getElementById('output2');
    if(n==0){
        document.getElementById("k_desc").innerHTML=k0[k];
    }
    if(n==1){
        document.getElementById("k_desc").innerHTML=k1[k];
    }
    if(n==2){
        document.getElementById("k_desc").innerHTML=k2[k];
    }
    if(n==3){
        document.getElementById("k_desc").innerHTML=k3[k];
    }
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