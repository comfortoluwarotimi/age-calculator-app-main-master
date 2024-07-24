//Show error messages based on value
// Function to validate input fields and apply appropriate classes based on their state
const validateInput = (input, validator) => {
    if (input.value === "") {
        // If input is empty, remove 'invalid-value' class and add 'empty-value' class
        input.parentElement.classList.remove("invalid-value");
        input.parentElement.classList.add("empty-value");
        return false; // Return false indicating invalid input
    } else if (!validator(input.value)) {
        // If input value is not valid, add 'invalid-value' class and remove 'empty-value' class
        input.parentElement.classList.add("invalid-value");
        input.parentElement.classList.remove("empty-value");
        return false; // Return false indicating invalid input
    } else {
        // If input value is valid, remove both 'invalid-value' and 'empty-value' classes
        input.parentElement.classList.remove("invalid-value");
        input.parentElement.classList.remove("empty-value");
        return true; // Return true indicating valid input
    }
};

// Function to check if the day is valid based on month and year
const isDayValid = (day, month, year) => {
    // Check if the year is a leap year
    const leapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    // Number of days in each month
    const maxDays = [
        31, // January
        leapYear ? 29 : 28, // February
        31, // March
        30, // April
        31, // May
        30, // June
        31, // July
        31, // August
        30, // September
        31, // October
        30, // November
        31, // December
    ];
    // Validate the day
    return Number.isInteger(day) && day >= 1 && day <= maxDays[month - 1];
};

// Function to check if the month is valid
const isMonthValid = (month) => {
    // Validate the month
    return Number.isInteger(month) && month >= 1 && month <= 12;
};

// Function to check if the year is valid
const isYearValid = (year) => {
    // Get the invalid year message element
    const invalidYearMsg = document.querySelector(".invalid-year");
    if (year <= 1970) {
        // Set message for years <= 1970
        invalidYearMsg.textContent = "Year Must be greater than 1970";
    } else {
        // Set message for years > current year
        invalidYearMsg.textContent = "Must be in the past";
    }

    // Get the current year
    const currentYear = new Date().getFullYear();
    // Validate the year
    return Number.isInteger(year) && year >= 1971 && year <= currentYear; // 1970 = Unix epoch
};

// Handle the form submission event
const form = document.querySelector("form"); // Get the form element
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get input elements for day, month, and year
    const dayInput = document.querySelector(".input__day");
    const monthInput = document.querySelector(".input__month");
    const yearInput = document.querySelector(".input__year");

    // Validate day input
    const isDayInputValid = validateInput(dayInput, (value) =>
        isDayValid(
            Number(value), // Convert value to number
            Number(monthInput.value), // Convert month input to number
            Number(yearInput.value) // Convert year input to number
        )
    );
    // Validate month input
    const isMonthInputValid = validateInput(monthInput, (value) =>
        isMonthValid(Number(value)) // Convert value to number and validate
    );
    // Validate year input
    const isYearInputValid = validateInput(yearInput, (value) =>
        isYearValid(Number(value)) // Convert value to number and validate
    );

    // If all inputs are valid, calculate the age
    if (isDayInputValid && isMonthInputValid && isYearInputValid) {
        // Format the value into a date object
        const inputDate = new Date(
            Number(yearInput.value), // Convert year input to number
            Number(monthInput.value) - 1, // Convert month input to number (month is zero-indexed)
            Number(dayInput.value) // Convert day input to number
        );
        // Calculate the time difference between the current date and input date
        const timeDiff = new Date() - inputDate;
        // Convert the time difference to a date object
        const ageDate = new Date(timeDiff);
        // Calculate age in years
        const ageYear = ageDate.getUTCFullYear() - 1970; // Subtract 1970 to get the correct age
        // Calculate age in months
        const ageMonth = ageDate.getUTCMonth();
        // Calculate age in days
        const ageDay = ageDate.getUTCDate() - 1; // Subtract 1 to get the correct number of days

        // Counter animation elements
        const dayElement = document.querySelector(".age__day");
        const monthElement = document.querySelector(".age__month");
        const yearElement = document.querySelector(".age__year");

        // Target values for the counters
        const targetDay = ageDay;
        const targetMonth = ageMonth;
        const targetYear = ageYear;

        // Animate the counters
        animateCounter(dayElement, targetDay);
        animateCounter(monthElement, targetMonth);
        animateCounter(yearElement, targetYear);

        // Function to animate counter
        function animateCounter(element, targetValue) {
            const duration = 5000; // Duration of the animation in milliseconds
            const interval = 50; // Interval for updating the counter in milliseconds
            const increment = Math.ceil(targetValue / (duration / interval)); // Increment value for each interval
            let currentValue = 0; // Starting value
            let intervalId;

            // Function to update the counter value
            function updateValue() {
                element.textContent = currentValue; // Update the text content with the current value

                if (currentValue >= targetValue) {
                    clearInterval(intervalId); // Stop the animation when target is reached
                } else {
                    currentValue += increment; // Increment the current value
                }
            }

            intervalId = setInterval(updateValue, interval); // Start the animation
        }
    }
});
