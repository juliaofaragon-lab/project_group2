import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

document.addEventListener('DOMContentLoaded', () => {

    new Accordion(".accordion-container", {
        showMultiple: false,
        duration: 500,
        triggerClass: "ac-trigger",
        elementClass: "ac",
        panelClass: "ac-panel",
        activeClass: 'is-active',
    });

});
