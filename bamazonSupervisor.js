var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bamazon'
});

connection.connect();

inquirer.prompt([
  {
    message: "What would you like to do?",
    type: "list",
    name: "supervisorAction",
    choices: ["View Product Sales by Department", "Create New Department"]
  }
]).then(function (ans) {
  switch (ans.supervisorAction) {
    case "View Product Sales by Department":
      viewSalesByDept()
      break;
    case "Create New Department":
      createNewDept()
      break;
  
    default:
      break;
  }
})

function viewSalesByDept () {
  var query = "Select * from products p inner join departments d on p.department_name = d.department_name"
  connection.query(query, function (error, res) {
    if (error) throw error;
    console.log(res);
    res.forEach(row => {
      var totalProfit = row.product_sales - row.over_head_costs
      console.log(`Department Id: ${row.department_id} Department Name: ${row.department_name} Overhead Costs: ${row.over_head_costs} Product Sales: ${row.product_sales} Total Profit: ${totalProfit}\n`)
    });
    connection.end()
  })
}
function createNewDept() {
  inquirer.prompt([
    {
      message: "Please type in the name of the department you would like to add.",
      type: "input",
      name: "deptName"
    },
    {
      message: "What is the overhead for this department?",
      type: "input",
      name: "overHeadCost"
    }
  ]).then(function (ans) {
    var query = "Insert into departments (department_name, over_head_costs) values(?, ?)"
    connection.query(query, [ans.deptName, parseInt(ans.overHeadCost)], function (error, res) {
      if (error) throw error;
      console.log(res);
      connection.end()
    })
  })


}