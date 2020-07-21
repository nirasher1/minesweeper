/*
    get buttons array that each element is an object - { title: "string", onClick: "callback" }
 */
export default class MessageModal {
    constructor(message = "", shouldShowOKButton, buttons = null) {
        this.message = message;
        this.buttons = buttons;
        this._containerElement = document.createElement("div");
        this.shouldShowOKButton = shouldShowOKButton;
    }

    render() {
        this._containerElement.classList.add("message-modal-container");

        const messageModalElement = document.createElement("div");
        messageModalElement.classList.add("message-modal");
        this._containerElement.appendChild(messageModalElement);

        let messageElement = document.createTextNode(this.message);
        messageModalElement.appendChild(messageElement);

        if (this.shouldShowOKButton || this.buttons !== null) {
            let buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("message-modal-buttons")

            if (this.shouldShowOKButton) {
                const okButtonObject = {
                    title: "OK",
                    onClick: () => document.body.removeChild(this._containerElement)
                };
                if (this.buttons === null) {
                    this.buttons = [okButtonObject]
                } else {
                    this.buttons.unshift(okButtonObject)
                }
            }

            if (this.buttons !== null) {
                this.buttons.forEach(button => {
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

        document.body.appendChild(this._containerElement);
    }
}