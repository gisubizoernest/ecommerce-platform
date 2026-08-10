import { prisma } from '../config/prisma'
import { stripe } from '../config/stripe'

export async function createCheckoutSession(userId: string, addressId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  })

  if (cartItems.length === 0) throw new Error('Cart is empty')

  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.product.name },
      unit_amount: Math.round(Number(item.product.price) * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    success_url: `http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:5173/cart`,
    metadata: { userId, addressId },
  })

  return session.url
}

export async function confirmOrder(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') throw new Error('Payment not completed')

  const userId = session.metadata?.userId as string

  const existing = await prisma.payment.findFirst({ where: { stripePaymentId: sessionId } })
  if (existing) return prisma.order.findUnique({ where: { id: existing.orderId }, include: { items: true } })

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  })

  const total = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  const address = await prisma.address.findUnique({ where: { id: session.metadata?.addressId as string } })

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      shippingLine1: address?.line1 || 'N/A',
      shippingCity: address?.city || 'N/A',
      shippingState: address?.state || 'N/A',
      shippingZip: address?.postalCode || 'N/A',
      status: 'PAID',
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
      payment: {
        create: {
          stripePaymentId: sessionId,
          amount: total,
          status: 'SUCCEEDED',
        },
      },
    },
    include: { items: true },
  })

  await prisma.cartItem.deleteMany({ where: { userId } })

  return order
}