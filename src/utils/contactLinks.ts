export function getCleanPhoneDigits(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits || '+917710039324';
}

export function getWhatsAppUrl(whatsappNumber: string, customMessage?: string): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, '') || '917710039324';
  const normalized = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
  const defaultMsg =
    "Hi, I'm interested in joining Shirsekar's Fitness Hub. I'd like to know about membership plans.";
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${normalized}?text=${text}`;
}

export function getFreeTrialWhatsAppUrl(
  whatsappNumber: string,
  details?: { name?: string; goal?: string; preferredDate?: string; preferredTime?: string }
): string {
  if (details?.name) {
    const msg = `Hi, I'd like to book a free trial at Shirsekar's Fitness Hub.\nName: ${details.name}\nGoal: ${details.goal || 'General Fitness'}\nPreferred Visit: ${details.preferredDate || 'Upcoming'} (${details.preferredTime || 'Flexible'})`;
    return getWhatsAppUrl(whatsappNumber, msg);
  }
  return getWhatsAppUrl(
    whatsappNumber,
    "Hi, I'd like to book a free trial at Shirsekar's Fitness Hub."
  );
}

export function getMembershipWhatsAppUrl(whatsappNumber: string, planName?: string): string {
  if (planName) {
    return getWhatsAppUrl(
      whatsappNumber,
      `Hi, I'm interested in the ${planName} Membership Plan at Shirsekar's Fitness Hub (Bandra East). Please share current rates and details.`
    );
  }
  return getWhatsAppUrl(
    whatsappNumber,
    "Hi, I'm interested in joining Shirsekar's Fitness Hub. I'd like to know about membership plans."
  );
}
