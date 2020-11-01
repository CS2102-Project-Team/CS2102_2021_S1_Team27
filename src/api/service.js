import request from '@/utils/request'

export function getService(data) {
  const { from, to } = data
  return new Promise((resolve, reject) => {
    request({
      url: '/admin/service',
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
          const cat = Math.floor(Math.random() * Math.floor(10000))
          const dog = Math.floor(Math.random() * Math.floor(10000))
          const fish = Math.floor(Math.random() * Math.floor(10000))
          return {
            month,
            pethour: {
              cat, dog, fish
            }
          }
        })
      )(currentYear, currentMonth)
      resolve(revArray)
    })
  })
}
