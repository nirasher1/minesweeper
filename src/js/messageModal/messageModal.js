/*
    get buttons array that each element is an object - { title: "string", onClick: "callback" }
 */
export default class MessageModal {
    constructor(message = "", buttons = null) {
        this.message = message;
        this.buttons = buttons;
        this._containerElement = document.createElement("div");
    }

    render() {
        this._containerElement.classList.add("message-modal-container");;

        const messageModalElement = document.createElement("div");
        messageModalElement.classList.add("message-modal");
        this._containerElement.appendChild(messageModalElement);

        let messageElement = document.createTextNode(this.message);
        messageModalElement.appendChild(messageElement);


        if (this.buttons !== null) {
            let buttonsDiv = document.createElement("div");

            this.buttons.forEach(button => {
                if (button.title && button.onClick) {
                    let newButton = document.createElement("button");
                    newButton.innerText = button.title;
                    newButton.addEventListener("click", button.onClick);
                    buttonsDiv.appendChild(newButton);
                }
            });

            messageModalElement.appendChild(buttonsDiv);
        }

        document.body.appendChild(this._containerElement);
    }
}