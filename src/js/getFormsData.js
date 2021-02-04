class Appointment {
    constructor(name, email, service, phone ,date, time, notes) {
        this.name = name;
        this.email = email;
        this.service = service;
        this.phone = phone;
        this.date = date;
        this.time = time;
        this.notes = notes;
    }
}

class ContactRequest {
    constructor(name, email, comment) {
        this.name = name;
        this.email = email;
        this.comment = comment;
    }
}


function validateForm (fields) {
    const errors = [];
    fields.forEach(field => formFieldValidate(field, errors));

    return errors;
}

// Проверка полей формы
function formFieldValidate (field, errors) {
    const validateInfo = {
        name: {
            typeError: ["empty", "invalid"],
            regExp: /^([а-яёА-Я]{2,23}|[a-zA-Z]{2,23})$/gm,
            errors: ["Type your name", "Name required characters contain а-я or a-z only."]
        },
        phone: {
            typeError: ["empty", "invalid"],
            errors: ["Type your phone", "Incorrect format."]
        },
        email: {
            typeError: ["empty", "invalid"],
            regExp: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
            errors: ["Type your email", "Incorrect format. For example, john.doe@gmail.com"]
        },
        date: {
            typeError: ["empty", "invalid"],
            errors: ["Type here the date", "Incorrect format"]
        },
        time: {
            typeError: ["empty", "invalid"],
            errors: ["Type here the time", "Incorrect format"]
        },
    };
    let value = "";
    if (field.value) {
        value = field.value.trim();
    } else {
        value = field.textContent.trim();
    }

    let fieldType = "";

    if (!field.dataset.formElem) {
        fieldType = field.dataset.contactFormElem;
    } else {
        fieldType = field.dataset.formElem;
    }

    const validator = validateInfo[fieldType];

    if (validator) {
        if (!value) {
            field.dataset.typeError = validator.typeError[0];
            errors.push(createError(fieldType, validator.typeError[0], validator.errors[0]));
        } else if (validator.regExp && !validator.regExp.test(value)) {
            field.dataset.typeError = validator.typeError[1];
            errors.push(createError(fieldType, validator.typeError[1], validator.errors[1]));
        } else {
            field.removeAttribute("data-type-error");
        }
    }
}

function createError (fieldName, type, text) {
    return {
        field: fieldName,
        type: type,
        errorText: text
    };
}

// Получение данных из формы 
export function getFormData (DOMFields) {
    const formFields = document.querySelectorAll(DOMFields);
    const errors = validateForm(formFields);
    let receivedObj = {};
    
    function showErrors(errorsArr) {
        errorsArr.forEach((error) => {
            let field = document.querySelector(`${DOMFields.slice(0, DOMFields.length - 1 )} = ${error.field}]`);
            field.placeholder = error.errorText;
            field.classList.add("input-error");
        });
    }

    showErrors(errors);

    if (!errors.length) {
        let args = [];
        let value ="";
        if (DOMFields === '[data-form-elem]') {
            formFields.forEach(field => {
                if (field.value) {
                    value = field.value.trim();
                    args.push(value);
                } else {
                    value = field.textContent.trim();
                    args.push(value);
                }
                field.value = "";
                field.classList.remove("input-error");
            });
            receivedObj = new Appointment(...args);
        } else if (DOMFields === '[data-contact-form-elem]') {
            formFields.forEach(field => {
                value = field.value.trim();
                args.push(value);
                field.value = "";
                field.classList.remove("input-error");
            });
            receivedObj = new ContactRequest(...args);
        }
        return receivedObj;
    }
}
    
