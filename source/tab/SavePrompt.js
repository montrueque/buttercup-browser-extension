const {
    el,
    mount,
    unmount
} = require("redom");
const EventEmitter = require("events").EventEmitter;

const config = require("../common/config.js");

const NOPE = function() {};

function createPrompt(prompt) {
    let title = el(
        "span",
        {
            style: {
                fontSize: "16px",
                fontFamily: `Buttercup-OpenSans`,
                color: config.BUTTERCUP_GREEN
            }
        },
        "Save new credentials?"
    );
    prompt._yesButton = el(
        "button",
        {
            style: {
                position: "absolute",
                width: "40px",
                height: "20px",
                bottom: "15px",
                right: "60px"
            }
        },
        "Yes"
    );
    prompt._noButton = el(
        "button",
        {
            style: {
                position: "absolute",
                width: "40px",
                height: "20px",
                bottom: "15px",
                right: "15px"
            }
        },
        "No"
    );
    prompt._rootElement = el(
        "div",
        {
            style: {
                position: "fixed",
                top: "10px",
                right: "20px",
                padding: "15px",
                width: "140px",
                height: "80px",
                overflow: "hidden",
                background: config.BACKGROUND_DARK_TRANSPARENT,
                borderRadius: "3px",
                zIndex: 99999999
            }
        },
        title,
        prompt._yesButton,
        prompt._noButton
    );
}

class SavePrompt extends EventEmitter {

    constructor() {
        super();
        createPrompt(this);
    }

    get rootElement() {
        return this._rootElement;
    }

    close() {
        unmount(document.body, this.rootElement);
    }

    onNoClick(e) {
        e.preventDefault();
        this.close();
    }

    onYesClick(e) {
        e.preventDefault();
        this.close();
        chrome.runtime.sendMessage({ command: "open-add-last-login" }, NOPE);
        // chrome.tabs.create({'url': chrome.extension.getURL('setup.html#/addLastLogin')}, function() {});
    }

    show() {
        mount(document.body, this.rootElement);
        this._boundOnNoClick = this.onNoClick.bind(this);
        this._boundOnYesClick = this.onYesClick.bind(this);
        this._yesButton.addEventListener("click", this._boundOnYesClick, false);
        this._noButton.addEventListener("click", this._boundOnNoClick, false);
    }

}

module.exports = SavePrompt;
