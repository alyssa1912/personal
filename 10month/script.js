const correctPin = "1911";

const pins = document.querySelectorAll(".pin");

const pinScreen = document.getElementById("pin-screen");
const messageScreen = document.getElementById("message-screen");
const errorMessage = document.getElementById("error-message");


pins.forEach((pin, index) => {

    // When a number is entered
    pin.addEventListener("input", () => {

        // Move to the next box
        if (pin.value && index < pins.length - 1) {
            pins[index + 1].focus();
        }

        // Check PIN once all four numbers are entered
        if (index === pins.length - 1 && pin.value) {
            checkPin();
        }

    });


    // Backspace functionality
    pin.addEventListener("keydown", (event) => {

        if (event.key === "Backspace") {

            // If the current box is empty,
            // move back to the previous box
            if (!pin.value && index > 0) {

                pins[index - 1].focus();
                pins[index - 1].value = "";

            }
        }

    });

});


function checkPin() {

    let enteredPin = "";

    pins.forEach(pin => {
        enteredPin += pin.value;
    });


    if (enteredPin === correctPin) {

        errorMessage.textContent = "";

        setTimeout(() => {

            pinScreen.classList.add("hidden");
            messageScreen.classList.remove("hidden");

        }, 300);

    } else {

        errorMessage.textContent = "Hmm... that's not our little secret ♡";

        // Clear the PIN
        pins.forEach(pin => {
            pin.value = "";
        });

        // Return to the first box
        pins[0].focus();
    }
}