import './modules/firebase.js'
import { collection, addDoc, getDocs, setDoc, doc, getDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
import { showMessage } from './modules/toastify.js'
import {db} from './modules/firebase.js'
import { setUpNames, setUpList} from './modules/setUpNames.js'

window.next = next
window.codeGenerator = codeGenerator
window.checkForms = checkForms
window.getData = getData
window.saveData = saveData;
window.saveDataJoinSorteo = saveDataJoinSorteo
window.getDataList = getDataList
window.setFriend = setFriend
window.displaySecretFriend = displaySecretFriend
window.checkNumOfPlayes = checkNumOfPlayes
window.whatsapp = whatsapp
window.isFriendReady = isFriendReady
window.getParam =  getParam

let code = ''


//Genera el codigo del sorteo.

function codeGenerator(){
    for (let i = 0; i < 2 ; i++){
        let randomNum1 = Math.floor(Math.random() * (90 - 65) + 65) 
        let char = String.fromCharCode(randomNum1)
        code += char
        code += randomNum1
    }
    document.getElementById('codigoSorteo').value = code

    
}


//Shares the code via Whatsapp

function whatsapp(){
    const url = document.URL
    window.open(`whatsapp://send?text=${url}?code=${code} `)
}


function getParam(){
    const queryString = document.URL
    let paramString = queryString.split('?')
    console.log(paramString)
    if(paramString.length == 2){
        let kodeX = paramString[1].split('=')
        let kode = kodeX[1]
        document.getElementById('code').value = kode
      
    }
    
}






//Cambia una pantalla por otra

function next(before, after){
    document.getElementById(before).style.display = 'none';
    document.getElementById(after).style.display = 'block';
   
}

//Verifica que cada formulario este rellenado y si lo esta, llama a next() para cambiar de pantalla.

function checkForms(idForm, before, after){
    let form = document.getElementById(idForm)
    if (form.value.length <= 0){
        showMessage('Creo que se te ha olvidado rellenar algo :(', 'err')
       
    }else {
        showMessage('ok :)')
        setTimeout(next(before, after), 100)
    }

}


//pilla los datos de cada formulario del organizador del sorteo
function getData(data1, data2){  //each argument is the id of the form we want to obtain the data.

    let pieceoFData1 = document.getElementById(data1)  
    //en el caso de administrador : es el nº de participantes / 
    //en el caso de unirse a sorteo: es el codigo
    let pieceoFData2 = document.getElementById(data2)  //nombre de participante
    return [pieceoFData1.value, pieceoFData2.value]
}

//pilla los datos de la persona q se une al sorteo

 
//crea un doc en Firebase, crea una colleccion a la que se uniraN los que entren al sorteo
async function saveData(){
    let data = getData('participantes', 'yourName')
    try{
         await setDoc(doc(db, code, data[1]), {
            name: data[1]
        });
    
    getDataFromFirebase()

    }catch (error){
        console.log(error)
    }
    //save extra data

    try{
        await setDoc(doc(db, code, 'extraData'), {
            nPlayers: data[0]
        });

    }catch (error){
        console.log(error)
    }


}


//guarda el nombre de los que se unan al sorteo

async function saveDataJoinSorteo(){
    let data = getData('code', 'nameToJoin')
    try{
         await setDoc(doc(db, data[0], data[1]), {
            name: data[1]
        });

        checkNumOfPlayes()

       
    }catch (error){
        console.log(error)
    }
}


async function getNames(codigo){
    try{
        const querySnapshot = await getDocs(collection(db, codigo));
        console.log('call')
        setUpNames(querySnapshot.docs)

    }catch(error){
        console.log(error)
    }  
    
}
       
//pilla los nombres de todas las personas en el sorteo y las muestra en una lista

async function getDataFromFirebase(){
    
    let lista = document.getElementsByClassName('names-lista')
    let data = getData('participantes', 'yourName')
    let players = data[0]
    console.log(players)
    document.getElementById('toJoin').innerHTML = players
    let playersJoined = document.getElementById('joinedPeople')
    playersJoined.innerHTML = 1
    

  
     while(lista.length < players){  //mientras i se menor que el # de jugadores, se repite el loop y se llama cada 5 segundos
    
        await new Promise(r => setTimeout(r, 8000)).then(()=>getNames(code)) 
        playersJoined.innerHTML = lista.length
    }

    //cuando el # de jugadores unidos sea igual al total de los jugadores que en principio se unirian
    //se ejecuta este codigo:

    document.getElementById('load').style.display = 'none';
    document.getElementById('aviso1').style.display = 'none'
  

}


async function checkNumOfPlayes(){
    let lista = document.getElementsByClassName('names-lista')
    let data = getData('code', 'nameToJoin')
    let codig = data[0]

    //get players num

    const docRef = doc(db, codig, "extraData");
    const docSnap = await getDoc(docRef);
    let docinfo = docSnap.data()
    let numPLayers = docinfo.nPlayers
    console.log(numPLayers, typeof numPLayers)
    numPLayers = Number(numPLayers)
    console.log(numPLayers, typeof numPLayers)

   //

    document.getElementById('toJoin1').innerHTML = numPLayers
    let playersJoined = document.getElementById('joinedPeople1')
    playersJoined.innerHTML = 2

    while(lista.length < numPLayers){   
        await new Promise(r => setTimeout(r, 8000)).then(()=>getNames(codig)) 
        playersJoined.innerHTML = lista.length
    }  
    
    document.getElementById('load1').style.display = 'none';
    document.getElementById('aviso3').style.display = 'none'
    document.getElementById('get88').style.display = 'block'
}

//pilla todos los nombres de la coleccion que contenga el actual codigo

async function getDataList(){
    const querySnapshot = await getDocs(collection(db, code));
    let list = setUpList(querySnapshot.docs)
    console.log(list)
    randomize(list)
}


 function randomize(array){

    let list = array.sort(() => Math.random() - 0.5)
    console.log(list)
    for(let i = 0; i < list.length; i++){
        
        if(i === list.length -1){
          console.log(list[i] + ' le da a ' + list[0])
            setFriend(list[i], list[0] )
            
        }else{
          console.log(list[i] + ' le da a ' + list[i+1]) 
          setFriend(list[i], list[i+1])
        }
    }
}


async function setFriend(name, friendName){
    try{
        await setDoc(doc(db, code, name), {
        name: name,
        friend: friendName
    });
    }catch (error){
        console.log(error)
    }



}


function displaySecretFriend(situation){
    
    
    if(situation == 'admin'){
        let data = getData('participantes', 'yourName')
        let name = data[1]
        getSecretFriend(code, name, 'secretAdmin')
    
    }else if(situation === 'noAdmin'){

        let data = getData('code', 'nameToJoin')
        let codigo = data[0];
        let name = data[1];
        getSecretFriend(codigo, name, 'secretUser')
        

    }
    
}



async function getSecretFriend(codex, name, id){
    try{
        const docRef = doc(db, codex, name);
        const docSnap = await getDoc(docRef);
        let dataPlayer = docSnap.data()
        let secretFriendName = dataPlayer.friend
        console.log(secretFriendName)
        document.getElementById(id).innerHTML = secretFriendName
        

    }catch(error){
        console.log(error)
    }
  

    
}


async function isFriendReady(){

    let playerData  = getData('code', 'nameToJoin')
    const docRef = doc(db, playerData[0], playerData[1]);
    const docSnap = await getDoc(docRef);
    let datax = docSnap.data()
    if(datax.friend){
        next('waintingJoin', 'getsecretName')
    }else {
        showMessage('Parece que aún no estamos listos, espera unos segundos y vuelve a pulsar siguiente!','ño')
    }
}
