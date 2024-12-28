import { Expense } from "../entities/expense.entity";

function occurredInLastYear(date: Date): boolean {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  return date >= oneYearAgo && date <= now;
}

function generateLastYearGraph() {
  const graph = {};
  const now = new Date();
  let ago = new Date();
  ago.setFullYear(now.getFullYear() - 1);
  ago.setMonth(ago.getMonth() + 1);
  
  for (let index = 0; index < 12; index++) {
    const year = ago.getUTCFullYear();
    const month = ago.getMonth() + 1;
    graph[year + "-" + month] = {
      income: 0,
      outcome: 0,
    };
    ago.setMonth(ago.getMonth() + 1);
  }

  return graph
}

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
  const raport = {
    lastYear: {  
      income: 0,
      outcome: 0,
      graph: {},
    },
  }
  raport.lastYear.graph = generateLastYearGraph();
  for(const expense of expenses) {

    //create calendar
    const created = new Date(expense.created)

    const year = created.getUTCFullYear();
    const month = created.getMonth() + 1;
    const day = created.getDate();

    const formatedExpense = {
      id: expense.id,
      name: expense.name,
      amount: expense.amount * (expense.isTransactionOut ? -1 : 1),
      date: {
        year,
        month,
        day,
      }
    };

    //last year
    if(occurredInLastYear(created)) {
      const lastYearKey = year + "-" + month
      if (expense.isTransactionOut && raport.lastYear.graph[lastYearKey]) {
        raport.lastYear.outcome += expense.amount;
        raport.lastYear.graph[lastYearKey].outcome += expense.amount;
      }
      else {
        raport.lastYear.income += expense.amount;
        raport.lastYear.graph[lastYearKey].income += expense.amount;
      }
    }



  }

  stats['raport'] = raport;


  return stats;
}