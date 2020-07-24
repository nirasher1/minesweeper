/*
    get buttons array that each element is an object - { title: "string", onClick: "callback" }
 */
const _message = Symbol("message");
const _buttons = Symbol("buttons");
const _containerElement = Symbol("containerElement");
const _shouldShowOKButton = Symbol("shouldShowOKButton");

export default class MessageModal {
    constructor(message = "", shouldShowOKButton, buttons = null) {
        this[_message] = message;
        this[_buttons] = buttons;
        this[_containerElement] = document.createElement("div");
        this[_shouldShowOKButton] = shouldShowOKButton;
    }

    render() {
        this[_containerElement].classList.add("message-modal-container");

        const messageModalElement = document.createElement("div");
        messageModalElement.classList.add("message-modal");
        this[_containerElement].appendChild(messageModalElement);

        let messageElement = document.createTextNode(this[_message]);
        messageModalElement.appendChild(messageElement);

        if (this[_shouldShowOKButton] || this[_buttons] !== null) {
            let buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("message-modal-buttons");

            if (this[_shouldShowOKButton]) {
                const okButtonObject = {
                    title: "OK",
                    onClick: () => {
                        if (this[_containerElement] !== null) {
                            document.body.removeChild(this[_containerElement])
                        }
                    }
                };
                if (this[_buttons] === null) {
                    this[_buttons] = [okButtonObject]
                } else {
                    this[_buttons].unshift(okButtonObject)
                }
            }

            if (this[_buttons] !== null) {
                this[_buttons].forEach(button => {
                    if (button.title && button.onClick) {
                        let newButton = document.createElement("button");
                        newButton.innerText = button.title;
                        newButton.addEventListener("click", button.onClick);
                        buttonsDiv.appendChild(newButton);
                    }
                });
            }

            messageModalElement.appendChild(buttonsDiv);
        }

        document.body.appendChild(this[_containerElement]);
    }
}