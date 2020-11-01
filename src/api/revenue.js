import request from '@/utils/request'

export function getRevenue(data) {
  const { from, to } = data
  return new Promise((resolve, reject) => {
    request({
      url: '/admin/revenue',
      method: 'get',
      params: { from, to }
    }).then(response => {
      resolve(response)
    }).catch(error => {
      console.log(error)
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() // 2020
      const currentMonth = currentDate.getMonth() // start from 0
      const revArray = ((y, m) => Array.from(Array(12).keys())
        .reverse()
        .map(x => m - x)
        .map(x => [x >= 0 ? y : y - 1, (x + 12) % 12 + 1])
        .map(x => `${('0000' + x[0]).substr(-4)}-${('00' + x[1]).substr(-2)}`)
        .map(month => {
          const income = Math.floor(Math.random() * Math.floor(12580))
          const salary = Math.floor(Math.random() * Math.floor(income))
          const revenue = income - salary
          return {
            month,
            income,
            salary,
            revenue
          }
        })
      )(currentYear, currentMonth)
      resolve(revArray)
    })
  })
}
