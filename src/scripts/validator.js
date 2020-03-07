export class Validator {

    validatePopup(form) {
        let isValid = true;
        Array.from(form.elements).forEach((elem) => {
          const errorElem = document.querySelector(`#error-${elem.name}`);
          if (errorElem) {
            if(errorElem.textContent.length) {
              isValid = false;
            }
          }
        });
        if(form.classList.contains('reg-form')) {
          this.setDisableButton(document.querySelector('.button__reg'), !isValid);
        }
        if(form.classList.contains('login-form')) {
          this.setDisableButton(document.querySelector('.button__login'), !isValid);
        }
    }

    setDisableButton(button, isDisable) {
        let buttonDisableClass = "";
        if(button.classList.contains('button__login')) {
          buttonDisableClass = "button__login_disabled";
        }
        if(button.classList.contains('button__reg')) {
          buttonDisableClass = "button__reg_disabled";
        }
    
        if(isDisable) {
          button.classList.add(buttonDisableClass);
          button.setAttribute('disabled', true);
        } else {
          button.classList.remove(buttonDisableClass);
          button.removeAttribute('disabled', false);
        }  
    }

    validateField(event) {
        this.resetError(event.target);
        Array.from(event.target).forEach((elem) => {
          if (document.querySelector(`#error-${elem.name}`)) {
            this.resetError(elem);
          }
        });

        const message = this.getErrorMessage(event.target);

        const errorElement = document.querySelector(`#error-${event.target.name}`);
        errorElement.textContent = message;  
        
        if(event.target.classList.contains('login-input')) {
          this.validatePopup(document.forms.loginForm);
        }
        if(event.target.classList.contains('reg-input')) {
          this.validatePopup(document.forms.regForm);
        }
        
    }

    resetError(element) {
        const errorElement = document.querySelector(`#error-${element.name}`);
        errorElement.textContent = "";
    }

    getErrorMessage(element) {
        if(element.validity.valueMissing) { 
          return "Это обязательное поле";
        }
        if(element.validity.tooShort || element.validity.tooLong) {
          return `Должно быть от ${element.getAttribute('minlength')} до ${element.getAttribute('maxlength')} символов`;
        }
        if(element.getAttribute('pattern') && element.validity.patternMismatch) {
          return 'Неккоректный Email';
        }
        return "";
      }
}