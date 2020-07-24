import CELL_BADGE from "./boardUtils/cellBadge.js";
import USER_MARK from "./boardUtils/userMark.js"

const EXPOSED_CLASS = "exposed";
const NOT_EXPOSED_CLASS = "not-exposed";
const MISTAKE_MARK = "mistake-mark";
const BOMBED_CLASS = "bombed";
const MINE_BADGE_ID = "mine";
const IMAGES_FOLDER_PATH = "src/images/";
const MINE_ICON_NAME = "mine.png";

const _element = Symbol("element");
const _onClick = Symbol("onClick");
const _onContextMenu = Symbol("onContextMenu");
const _onContextMenuSignature = Symbol("onContextMenuSignature");
const _onPutFlag = Symbol("onPutFlag");
const _onDeleteFlag = Symbol("onDeleteFlag");
const _iconNodeElement = Symbol("iconNodeElement");

export default class Cell {
    constructor({
                    isMine = false,
                    isExposed = false,
                    minesAroundCount = 0,
                    onClick = () => {},
                    onPutFlag = () => {},
                    onDeleteFlag = () => {}
    }={}) {
        this.isMine = isMine;
        this.isExposed = isExposed;
        this.minesAroundCount = minesAroundCount;
        this.userMark = USER_MARK.NONE;
        this[_onClick] = onClick;
        this[_onPutFlag] = onPutFlag;
        this[_onDeleteFlag] = onDeleteFlag;
        this[_iconNodeElement] = null;
        this[_element] = document.createElement("td");
        this[_onContextMenuSignature] = this[_onContextMenu].bind(this);
        this[_element].addEventListener("click", this[_onClick]);
        this[_element].addEventListener("contextmenu", this[_onContextMenuSignature]);
    }

    removeAllListeners() {
        this[_element].removeEventListener("click", this[_onClick]);
        this[_element].removeEventListener("contextmenu", this[_onContextMenuSignature])
    }

    [_onContextMenu](e) {
        e.preventDefault();
        if (this.userMark === USER_MARK.NONE) {
            this[_onPutFlag]();
            this.userMark = USER_MARK.FLAG;
            this[_element].removeEventListener("click", this[_onClick]);
        } else if (this.userMark === USER_MARK.FLAG) {
            this[_onDeleteFlag]();
            this.userMark = USER_MARK.QUESTION_MARK;
            this[_element].removeEventListener("click", this[_onClick]);
        } else {
            this.userMark = USER_MARK.NONE;
            this[_element].addEventListener("click", this[_onClick]);
        }
        this.render();
    }

    markAsUserMistake() {
        this[_element].classList.add(MISTAKE_MARK);
        const xText = document.createElement("div");
        xText.innerText = "X";
        this[_element].appendChild(xText)
    }

    markAsBombed() {
        this[_element].classList.add(BOMBED_CLASS);
        this.render()
    }

    render() {
        let element = this[_element];
        let badgeId;
        if (this.isExposed) {
            if (this.isMine) {
                badgeId = MINE_BADGE_ID;
                if (this[_iconNodeElement] === null) {
                    this[_iconNodeElement] = document.createElement("img");
                    element.appendChild(this[_iconNodeElement])
                }
                this[_iconNodeElement].src = IMAGES_FOLDER_PATH + MINE_ICON_NAME;
            } else {
                badgeId = this.minesAroundCount;
                element.innerText = CELL_BADGE[badgeId].text;
            }
            element.classList.add(CELL_BADGE[badgeId].class);
            element.classList.add(EXPOSED_CLASS);
            element.classList.remove(NOT_EXPOSED_CLASS);
            if (this[_iconNodeElement] !== null && !this.isMine) {
                element.removeChild(this[_iconNodeElement])
            }
            this.removeAllListeners()
        } else {
            element.classList.add(NOT_EXPOSED_CLASS);
            if (this.userMark !== USER_MARK.NONE) {
                if (this[_iconNodeElement] === null) {
                    this[_iconNodeElement] = document.createElement("img");
                }
                this[_iconNodeElement].src = IMAGES_FOLDER_PATH + this.userMark;
                if (element.querySelector("img") === null) {
                    element.appendChild(this[_iconNodeElement])
                }
            } else {
                if (this[_iconNodeElement] !== null) {
                    element.removeChild(this[_iconNodeElement]);
                    this[_iconNodeElement] = null;
                }
            }
        }
        return element;
    }
}