import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './src/models/users.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:mongo@localhost:27017/salud_wearable?authSource=admin'

async function seedAdmin() {
  try {
    console.log('Conectando a MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('Conexión exitosa a MongoDB.')

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@salud.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234*'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const existingUser = await User.findOne({ email: adminEmail })

    if (existingUser) {
      existingUser.role = 'Admin'
      existingUser.password = hashedPassword
      existingUser.status = true
      existingUser.emailConfirmation = true
      existingUser.emailConfirmationToken = null
      existingUser.emailConfirmationExpires = null
      await existingUser.save()
      console.log(`\n✅ Usuario existente actualizado a Administrador:`)
    } else {
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrador General',
        phone: '12345678',
        emergency_phone: '87654321',
        address: 'Dirección Administrativa',
        age: 30,
        condition: ['Ninguna'],
        role: 'Admin',
        status: true,
        emailConfirmation: true,
        emailConfirmationToken: null,
        emailConfirmationExpires: null
      })
      console.log(`\n✅ Usuario Administrador creado exitosamente:`)
    }

    console.log(`-----------------------------------`)
    console.log(`📧 Email:    ${adminEmail}`)
    console.log(`🔑 Password: ${adminPassword}`)
    console.log(`🛡️ Rol:      Admin`)
    console.log(`✨ Confirmado: Sí`)
    console.log(`-----------------------------------\n`)

  } catch (error) {
    console.error('❌ Error al inyectar el usuario admin:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Desconectado de MongoDB.')
    process.exit(0)
  }
}

seedAdmin()
