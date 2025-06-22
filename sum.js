L = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Calculate sum using reduce function with step-by-step logging
const sum = L.reduce((accumulator, currentValue, index) => {
    console.log(`Step ${index + 1}: accumulator = ${accumulator}, currentValue = ${currentValue} → ${accumulator} + ${currentValue} = ${accumulator + currentValue}`);
    return accumulator + currentValue;
}, 0);

console.log("\nFinal Sum of array L:", sum);

