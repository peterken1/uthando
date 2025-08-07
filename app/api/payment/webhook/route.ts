import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Verify webhook signature (optional but recommended)
    // const signature = req.headers.get('x-yoco-signature');
    // if (!verifyWebhookSignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Handle successful payment
    if (body.type === 'payment.succeeded') {
      const payment = body.data;
      const userId = payment.metadata?.user_id;
      
      if (!userId) {
        console.error('No user_id in payment metadata');
        return NextResponse.json({ error: 'No user ID provided' }, { status: 400 });
      }

      // Calculate premium expiry (30 days from now)
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + 30);

      // Update user's premium status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          premium_until: premiumUntil.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user premium status:', updateError);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
      }

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'premium_purchase',
          amount: 30.00,
          description: '30-day premium subscription',
          yoco_payment_id: payment.id
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Don't fail the webhook for this, just log it
      }

      console.log(`Premium activated for user ${userId} until ${premiumUntil}`);
      return NextResponse.json({ success: true });
    }

    // Handle failed payment
    if (body.type === 'payment.failed') {
      const payment = body.data;
      const userId = payment.metadata?.user_id;
      
      if (userId) {
        // Record failed transaction
        await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            type: 'premium_purchase',
            amount: 30.00,
            description: '30-day premium subscription (failed)',
            yoco_payment_id: payment.id
          });
      }

      console.log(`Payment failed for user ${userId}`);
      return NextResponse.json({ success: true });
    }

    // Handle other webhook events
    console.log('Unhandled webhook event:', body.type);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Optional: Verify webhook signature for security
// function verifyWebhookSignature(payload: any, signature: string | null): boolean {
//   if (!signature || !process.env.YOCO_WEBHOOK_SECRET) {
//     return false;
//   }
//   
//   const crypto = require('crypto');
//   const expectedSignature = crypto
//     .createHmac('sha256', process.env.YOCO_WEBHOOK_SECRET)
//     .update(JSON.stringify(payload))
//     .digest('hex');
//   
//   return crypto.timingSafeEqual(
//     Buffer.from(signature),
//     Buffer.from(expectedSignature)
//   );
// }

