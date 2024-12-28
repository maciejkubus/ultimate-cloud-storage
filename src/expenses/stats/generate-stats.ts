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

  const now = new Date();

  const outcomeTransaction = expenses.filter(expense => expense.isTransactionOut).sort((a, b) => b.amount - a.amount).slice(0, 2)
  const incomeTransaction = expenses.filter(expense => !expense.isTransactionOut).sort((a, b) => b.amount - a.amount).slice(0, 2)

  //raport
  const raport = {
    lastYear: {  
      income: 0,
      outcome: 0,
      graph: {},
    },
    currentMonth: {
      income: 0,
      outcome: 0,
    },
    top: {
      outcome: outcomeTransaction,
      income: incomeTransaction,
    }
  }
  raport.lastYear.graph = generateLastYearGraph();
  for(const expense of expenses) {

    //create calendar
    const created = new Date(expense.created)

    const year = created.getUTCFullYear();
    const month = created.getMonth() + 1;
    const day = created.getDate();

    if(year == now.getUTCFullYear() && month == now.getMonth() + 1) {
      if(expense.isTransactionOut) 
        raport.currentMonth.outcome += expense.amount;
      else
        raport.currentMonth.income += expense.amount
    }

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