/// <reference types="cypress" />

describe('First test suite', () => {

    it('first test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //by tag name
        cy.get('input')

        //by id
        cy.get('#inputEmail1')

        //by Class value
        cy.get('.input-full-width')

        //by attribute name
        cy.get('[fullwidth]')

        //by atrribute and value
        cy.get('[placeholder="Email"]')

        //by entire class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //by two attributes
        cy.get('[placeholder="Email"][fullwidth]')

        //by tag, attribute, id and class
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        //by cypress test id
        cy.get('[data-cy="imputEmail1"]')
    })

    it('second test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // Theory
        // get() - find element on the page by locator globally
        // find() - find child elements by locator
        // contains() - find HTML text and by text and locator

        cy.contains('Sign in')
        cy.contains('[status="warning"]','Sign in')
        cy.contains('nb-card', 'Horizontal form').find('button')
        cy.contains('nb-card', 'Horizontal form').contains('Sign in')
        cy.contains('nb-card', 'Horizontal form').get('button')

        //cypress chains and DOM
        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()
    })

    it('save subject of the command', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain','Email')
        cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain','Password')

        // Saving subject of the command

        // 1 Cypress Alias
        cy.contains('nb-card', 'Using the Grid').as('usingTheGrid')
        cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain','Email')
        cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain','Password')

        // 2 Cypress then() method
        cy.contains('nb-card', 'Using the Grid').then(usingTheGridForm => {
            cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain','Email')
            cy.wrap(usingTheGridForm).find('[for="inputPassword2"]').should('contain','Password')
        })
    })

    it('extracting text values', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //1
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2
        cy.get('[for="exampleInputEmail1"]').then( label => {
            const labelText = label.text()
            expect(labelText).to.equal('Email address')
            cy.wrap(labelText).should('contain', 'Email address')
        })

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then( text => {
            expect(text).to.equal('Email address')
        })
        cy.get('[for="exampleInputEmail1"]').invoke('text').as('labelText').should('contain', 'Email address')

        //4
        cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class').then( classValue => {
            expect(classValue).to.equal('label')
        })

        //5 invoke property
        cy.get('#exampleInputEmail1').type('test@test.com')
        cy.get('#exampleInputEmail1').invoke('prop', 'value').should('contain', 'test@test.com').then(property => {
            expect(property).to.equal('test@test.com')
        })
    })

    it.only('radio buttons', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radionButtons => {
            cy.wrap(radionButtons).eq(0).check({force: true}).should('be.checked')
            cy.wrap(radionButtons).eq(1).check({force: true})
            cy.wrap(radionButtons).eq(0).should('not.be.checked')
            cy.wrap(radionButtons).eq(2).should('be.disabled')

        })
    })

    it('checkboxes', () => {

        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        cy.get('[type="checkbox"]').check({force: true})
    })

    it('date picker', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()



        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()

            function selectDayFromCurrent(day) {

                let date = new Date()
                date.setDate(date.getDate() + day)
                let futureDay = date.getDate()
                let futureMonth = date.toLocaleDateString('en-US', {month: 'short'})
                let futureYear = date.getFullYear()
                let dateToAssert = `${futureMonth} ${futureDay}, ${futureYear}`

                cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
                    if(!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)) {
                        cy.get('[data-name="chevron-right"]').click()
                        selectDayFromCurrent(day)
                    } else {
                        cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
                    }
                })

                return dateToAssert
            }

           const dateToAssert =  selectDayFromCurrent(5)

            cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert)
            cy.wrap(input).should('have.value', dateToAssert)
        })
    })

    it('Lists and dropdowns', () => {

        cy.visit('/')

        //1
        cy.get('nav nb-select').click()
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain', 'Dark')

        //2
        cy.get('nav nb-select').then(dropDown => {
            cy.wrap(dropDown).click()
            cy.get('.options-list nb-option').each( (listItem, index) => {
                const itemText = listItem.text().trim()
                cy.wrap(listItem).click()
                cy.wrap(dropDown).should('contain', itemText)
               if(index < 3) {
                   cy.wrap(dropDown).click()
               }
            })
        })
    })

    it('Wet tables', () => {

        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //1 Get the row by text
        cy.get('tbody').contains('tr', 'Larry').then( tableRow => {
            cy.wrap(tableRow).find('nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('35')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '35')
        })

    })

})

