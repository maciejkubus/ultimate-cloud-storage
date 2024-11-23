import { Expense } from "../entities/expense.entity";

export function generateStats(expenses: Expense[]) {
  const stats = {}

  //sum
  let sum = 0;
  for(const expense of expenses) {
    if(expense.isTransactionOut) sum -= expense.amount;
    else sum += expense.amount
  }
  stats['sum'] = sum

  //raport
  const raport = {}
  for(const expense of expenses) {
    //create calendar
    const created = new Date(expense.created)

    const year = created.getUTCFullYear();
    if(!raport[year]) raport[year] = {};

    const month = created.getMonth() + 1;
    if(!raport[year][month]) raport[year][month] = {};

    const day = created.getDate();
    if(!raport[year][month][day]) raport[year][month][day] = [];

    //add expense to calendar
    raport[year][month][day].push({
      id: expense.id,
      name: expense.name,
      amount: expense.amount * (expense.isTransactionOut ? -1 : 1),
      date: {
        year,
        month,
        day,
      }
    });

  }

  stats['raport'] = raport;


  return stats;
}