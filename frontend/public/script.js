console.log('loaded')

const readingBeers = () => {
  fetch(`http://127.0.0.1:9000/data`) // fontos, hogy itt az endpoint url-t adjuk meg
  .then(response => {
    console.log(response)
    if (response.status === 201) {
      console.log('ok')
    }
    return response.json()
  })
  .then(responseJson => {
    console.log(responseJson)
    const data = responseJson
    let html = ""
    data.forEach(element => {
      html = html+`
      <h3>${element.name}</h3>
      <span><strong>Abv.: </strong> ${element.abv}</span>
      <span><strong>Brewery: </strong>${element.brewery}</span>
      `
    });
    beerListElement.innerHTML = html
  })
} 
readingBeers();

// UPLOAD DATA AND FILES 
const formComponent = () => `
  <form id="upload-file">
    <input type="text" placeholder="Image name" name="name">
    <input type="file" name="file">
    <button>SEND</button>
  </form>
`

const newBeerComponent = () => `
  <form id="add-beer">
    <input type="text" name="beerName" placeholder="Beer name">
    <input type="text" name="abv" placeholder="beer abv">
    <input type="text" name="brewery" placeholder="brewery">
    <button>Add new</button>
  </form>
`
const rootElement = document.querySelector('#root')

rootElement.insertAdjacentHTML('beforeend', formComponent())
rootElement.insertAdjacentHTML('beforeend', newBeerComponent())
rootElement.insertAdjacentHTML('beforeend', '<div id="beer-list"></div>')

const beerListElement = document.querySelector('#beer-list')

const formElement = document.querySelector('#upload-file')
formElement.addEventListener('submit', (event)=> {
  event.preventDefault()
  console.log("Submitted")

  const formData = new FormData()
  formData.append('name', document.querySelector(`input[type='text']`).value) //!!! Attribútum alapján kiszelektálni elemeket
  formData.append('image', document.querySelector(`input[type='file']`).files[0]) // ez mindig egy tömb lesz meg ha egy eleme van is

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    console.log("res", res)
    if(res.status === 200) {
      console.log('Success!')
      return res.json()
    }else {
      console.log("ERROR!")
    }
  }) // kicsomagoljuk
  .then(resData => { // resData = "pelda"
    console.log(resData)
    rootElement.insertAdjacentHTML('beforeend', `<img src="./public/${resData}.jpg">`)
  })
  .catch(error => console.log(error))
})

//EZ A MAI
const addNewFormElement = document.querySelector("#add-beer")
addNewFormElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const product = {
    name: document.querySelector('input[name="beerName"]').value,
    abv: document.querySelector('input[name="abv"]').value,
    brewery: document.querySelector('input[name="brewery"]').value
  };
  //console.log('Ez itt a product: ', product)

  fetch('/new', {
    method: "POST",
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(product),
  })
  .then(res => {
    readingBeers();
    addNewFormElement.reset();
  })
})