// lib/db/seed.ts
import data from '@/lib/data'
import { connectToDatabase } from '@/lib/db' // your Mongoose connect function
import Product from './models/product.model'
import User from './models/user.model'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(cwd())

const main = async () => {
  try {
    console.log('Connecting to database...')
    await connectToDatabase() // ← CONNECT FIRST!
    console.log('Connected! Starting seed...')

    const { products, users } = data

    // Now it's safe to use the DB
    await User.deleteMany({})
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers.find((u) => u.role === 'Admin')?._id

    await Product.deleteMany({})
    const productsWithSeller = products.map((p) => ({
      ...p,
      seller: adminUser || createdUsers[0]._id,
    }))
    const createdProducts = await Product.insertMany(productsWithSeller)

    console.log('Seeded successfully!')
    console.log(
      `Users: ${createdUsers.length}, Products: ${createdProducts.length}`
    )
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

main()
