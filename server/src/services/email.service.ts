import { transporter } from '../config/mailer'

export async function sendOrderConfirmationEmail(to: string, order: any) {
  const itemsList = order.items
    .map((item: any) => `${item.quantity} × ${item.product?.name || 'Item'} — $${Number(item.price).toFixed(2)}`)
    .join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #131a2b;">Order Confirmed 🎉</h2>
      <p>Thank you for your order! Here's your confirmation.</p>
      <p><strong>Order #:</strong> ${order.id.slice(0, 8)}</p>
      <p><strong>Total:</strong> $${Number(order.total).toFixed(2)}</p>
      <h3>Items</h3>
      <pre style="background: #f7f8fa; padding: 12px; border-radius: 8px;">${itemsList}</pre>
      <p><strong>Shipping to:</strong><br/>${order.shippingLine1}, ${order.shippingCity}, ${order.shippingState} ${order.shippingZip}</p>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">ShopHub — this is an automated message.</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"ShopHub" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Order Confirmation — #${order.id.slice(0, 8)}`,
      html,
    })
  } catch (err) {
    console.error('Email send error:', err)
  }
}