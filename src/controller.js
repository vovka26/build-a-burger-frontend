BASE_URL = 'https://fun-burger-maker.herokuapp.com'

class Controller {
  constructor() {
  }

  getAllIngredients() {
    fetch(`${BASE_URL}/ingredients`)
    .then(res => res.json())
    .then(json => {
      const h2 = document.createElement('h2')
      h2.innerText = 'Choose your ingredients:'
      document.querySelector('.ingredients-list-container').insertBefore(h2, document.querySelector('.ingredients-list-container').children[0])

      json.forEach((ingredient) => {
        let ingredientInstance = new Ingredient(ingredient.id, ingredient.name, ingredient.image_url)
        ingredientInstance.render()
      })

      //// CLEAR & DONE BUTTONS ////
      let clearButton = document.createElement('button')
      clearButton.innerText = "Clear"
      clearButton.classList.add('btn')
      clearButton.classList.add('btn-primary')
      clearButton.classList.add('two-buttons')
      clearButton.addEventListener('click', () => this.clearBurgerDisplay())

      let doneButton = document.createElement('button')
      doneButton.innerText = "Done"
      doneButton.classList.add('btn')
      doneButton.classList.add('btn-primary')
      doneButton.classList.add('two-buttons')
      doneButton.addEventListener('click', () => this.renderBurgerFormModal())

      let divTwoButtonsContainer = document.createElement('div')
      divTwoButtonsContainer.classList.add('two-buttons-container')
      divTwoButtonsContainer.appendChild(clearButton)
      divTwoButtonsContainer.appendChild(doneButton)
      document.querySelector('.ingredients-list-container').appendChild(divTwoButtonsContainer)
    })
  }

  getAllBurgers() {
    fetch(`${BASE_URL}/burgers`)
    .then(res => res.json())
    .then(json => {
      const h2 = document.createElement('h2')
      h2.innerText = 'Burger Creations:'

      document.querySelector('.burgers-list-container ').insertBefore(h2, document.querySelector('.burgers-list-container ').children[0])

      json.forEach((burger) => {
        let burgerInstance = new Burger(burger.id, burger.name, burger.owner_name, burger.ingredients)
        burgerInstance.render()
      })
    })
  }

  createBurger(burgerObj) {
    fetch(`${BASE_URL}/burgers`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(burgerObj)
    }).then(res => res.json())
      .then(burger => {
        let newBurger = new Burger(burger.id, burger.name, burger.owner_name, burger.ingredients)
        newBurger.render()
      })
  }

  handleBurgerSubmit(e){
    e.preventDefault()

    const burgerForm = e.target
    if (burgerForm.dataset.id != '') {
      const arrayOfIngredientIds = this.collectIngredientsIdIntoArray()
      const updatedBurger = new Burger(parseInt(burgerForm.dataset.id), burgerForm[0].value, burgerForm[1].value, arrayOfIngredientIds);
      updatedBurger.update()
      burgerForm.dataset.id = '';
    } else {
      const burgerName = burgerForm[0].value
      const burgerCreatorName = burgerForm[1].value
      const burgerIngredientsIds = this.collectIngredientsIdIntoArray()

      if (burgerName != '' && burgerCreatorName != '' && burgerIngredientsIds.length > 0) {
        const newBurgerData = {
          burger: {
            name: burgerName,
            owner_name: burgerCreatorName,
            ingredients: burgerIngredientsIds
          }
        }
        this.createBurger(newBurgerData)
        this.clearBurgerDisplay()
      }
    }
    burgerForm.reset();

    const formModal = document.getElementById('burger-form-modal')
    this.closeModal(formModal)
  }

  collectIngredientsIdIntoArray() {
    const burgerDisplayDiv = document.querySelector('.burger-display');
    let ingredientsArray = [];

    burgerDisplayDiv.childNodes.forEach(ingredientElement => {
      ingredientsArray.push(parseInt((ingredientElement.id).split("image-")[1]))
    })

    return ingredientsArray
  }

  renderHomeDisplay(){
    const display = document.querySelector('.burger-display')
    display.classList.add('d-flex')
    display.classList.add('justify-content-center')
    display.id = 'welcome-display'

    const burgerGif = document.createElement('img')
    burgerGif.src = 'images/burger-logo.gif'

    display.appendChild(burgerGif)

    burgerGif.addEventListener('click', () => {this.removeHiddenProperties()})
  }

  removeHiddenProperties(){
    const display = document.querySelector('.burger-display')
    display.removeAttribute('id')

    while (display.firstChild) {
    	display.removeChild(display.firstChild)
	  }

    document.querySelector('.ingredients-list-container').classList.remove('hidden')
    document.querySelector('.burgers-list-container').classList.remove('hidden')
    document.querySelector('.burger-info-1').classList.remove('hidden')
    document.querySelector('.burger-info-2').classList.remove('hidden')
  }

  renderBurgerFormModal() {
    const burgerDisplayDiv = document.querySelector(`.burger-display`)

    if (burgerDisplayDiv.childElementCount === 0) {
      const noIngredientsModal = document.getElementById('no-ingredients-error-modal')
      this.showModal(noIngredientsModal)

      const xBtn = document.getElementById('exit-no-ingr-modal')
      xBtn.addEventListener('click', () => {
        this.closeModal(noIngredientsModal)
      })
    } else {
      const formModal = document.getElementById('burger-form-modal')
      this.showModal(formModal)

      const burgerForm = document.getElementById('burger-form')

      burgerForm.addEventListener('submit', this.handleBurgerSubmit.bind(this))

      const xBtn = document.getElementById('exit-burger-form-modal')
      xBtn.addEventListener('click', () => {
        this.closeModal(formModal)
      })
    }
  }

  showModal(modalElement) {
    modalElement.classList.add("show")
    modalElement.classList.add("block")
  }

  closeModal(modalElement) {
    modalElement.classList.remove("show")
    modalElement.classList.remove("block")
  }

  clearBurgerDisplay() {
    document.querySelector('.burger-display').innerHTML = ''
  }

}
