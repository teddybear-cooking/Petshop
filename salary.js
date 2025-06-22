L = [ 

    {id:6511234,name:'Jack',salary:10000}, 
    
    {id:6511235,name:'Mike',salary:15000}, 
    
    {id:6511236,name:'Nancy',salary:20000}, 
    
    {id:6511237,name:'Alice',salary:30000}, 
    
    ] 

// Use simple Array.map() to add bonus column (20% increase)
const employeesWithBonus = L.map(function(employee) {
    return {
        id: employee.id,
        name: employee.name,
        salary: employee.salary,
        bonus: employee.salary * 0.20
    };
});

console.log("Original employees:", L);
console.log("\nEmployees with bonus:", employeesWithBonus); 