
const names = document.querySelector('.names-post')


// hace que los datos pillados de fireBase sean entendibles y mete a cada item en un elemento li para hacer una lista

export const setUpNames = (data) => {
    
    let html = ''

    data.forEach(doc => {
        const post = doc.data();
        if(post.name){
            const li = `
            <li class="list-group-item list-group-item-action names-lista"> 
            <h2> ${post.name}</h2>
            </li>
    
            `
            html += li
          
            
           
        }
       
        
    })
    
    names.innerHTML = html
    console.log(names)

    
}

//pilla cada nombre de firebase y los mete a una lista para mas tarde hacer el random

export const setUpList = (data) => {

    let nameList = []

    data.forEach(doc =>{
        const itemName = doc.data()
        if(itemName.name){
            nameList.push(`${itemName.name}`)
        }
       

    })

    return  nameList
}

