import CELL_BADGE from "./cellBadge.js";
import USER_MARK from "./boardUtils/userMark.js"

const EXPOSED_CLASS = "exposed";
const NOT_EXPOSED_CLASS = "not-exposed";
const BOMBED_CLASS = "bombed";
const MINE_BADGE_ID = "mine";
const IMAGES_FOLDER_PATH = "src/images/";
const MINE_ICON_NAME = "mine.png";

const onContextMenu = (e, cell) => {
    e.preventDefault();
    if (cell.userMark === USER_MARK.NONE) {
        cell.userMark = USER_MARK.FLAG;
        cell._element.removeEventListener("click", cell.onClick);
    } else if (cell.userMark === USER_MARK.FLAG) {
        cell.userMark = USER_MARK.QUESTION_MARK;
        cell._element.removeEventListener("click", cell.onClick);
    } else {
        cell.userMark = USER_MARK.NONE;
        cell._element.addEventListener("click", cell.onClick);
    }
    cell.render();
};


export default class Cell {
    constructor({isMine = false, isExposed = false, minesAroundCount = 0, onClick = () => {}}={}) {
        this.isMine = isMine;
        this.isExposed = isExposed;
        this.minesAroundCount = minesAroundCount;
        this.onClick = onClick;
        this.onContextMenu = (e) => onContextMenu(e, this);
        this.userMark = USER_MARK.NONE;
        this.iconNode = null;
        this._element = document.createElement("td");
        this._element.addEventListener("click", this.onClick);
        this._element.addEventListener("contextmenu", this.onContextMenu);
    }

    removeAllListeners() {
        this._element.removeEventListener("click", this.onClick);
        this._element.removeEventListener("contextmenu", this.onContextMenu)
    }

    markAsBombed() {
        this._element.classList.add(BOMBED_CLASS);
        this.render()
    }

    render() {
        let element = this._element;
        let badgeId;
        if (this.isExposed) {
            if (this.isMine) {
                badgeId = MINE_BADGE_ID;
                if (this.iconNode === null) {
                    this.iconNode = document.createElement("img");
                    element.appendChild(this.iconNode)
                }
                this.iconNode.src = IMAGES_FOLDER_PATH + MINE_ICON_NAME;
            } else {
                badgeId = this.minesAroundCount;
                element.innerText = CELL_BADGE[badgeId].text;
            }
            element.classList.add(CELL_BADGE[badgeId].class);
            element.classList.add(EXPOSED_CLASS);
            element.classList.remove(NOT_EXPOSED_CLASS);
            if (this.iconNode !== null && !this.isMine) {
                element.removeChild(this.iconNode)
            }
            this.removeAllListeners()
        } else {
            element.classList.add(NOT_EXPOSED_CLASS);
            if (this.userMark !== USER_MARK.NONE) {
                if (this.iconNode === null) {
                    this.iconNode = document.createElement("img");
                }
                this.iconNode.src = IMAGES_FOLDER_PATH + this.userMark;
                if (element.querySelector("img") === null) {
                    element.appendChild(this.iconNode)
                }
            } else {
                if (this.iconNode !== null) {
                    element.removeChild(this.iconNode);
                    this.iconNode = null;
                }
            }
        }
        return element;
    }
}