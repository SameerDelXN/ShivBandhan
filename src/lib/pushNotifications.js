
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotification(pushToken, title, message, data = {}) {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return false;
  }

  console.log(`[Push] Attempting to send to token: ${pushToken}`);
  const chunks = expo.chunkPushNotifications([
    {
      to: pushToken,
      sound: 'default',
      title: title,
      body: message,
      data: data,
    },
  ]);

  const tickets = [];
  for (const chunk of chunks) {
    try {
      console.log('[Push] Sending chunk...');
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('[Push] Ticket received:', ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('[Push] Error sending chunk:', error);
    }
  }
  
  return tickets;
}
