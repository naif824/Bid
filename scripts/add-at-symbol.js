const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Fetch all items without @
  const itemsToUpdate = await prisma.item.findMany({
    where: {
      sellerName: {
        not: {
          startsWith: '@'
        }
      }
    }
  })

  console.log(`Updating ${itemsToUpdate.length} items...`)
  
  for (const item of itemsToUpdate) {
    await prisma.item.update({
      where: { id: item.id },
      data: { sellerName: `@${item.sellerName}` }
    })
  }

  // Fetch all bids without @
  const bidsToUpdate = await prisma.bid.findMany({
    where: {
      bidderName: {
        not: {
          startsWith: '@'
        }
      }
    }
  })

  console.log(`Updating ${bidsToUpdate.length} bids...`)
  
  for (const bid of bidsToUpdate) {
    await prisma.bid.update({
      where: { id: bid.id },
      data: { bidderName: `@${bid.bidderName}` }
    })
  }

  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
