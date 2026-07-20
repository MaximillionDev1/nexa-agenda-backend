export function normalizePhone(phone: string): string {
  console.log('=== DEBUG: normalizePhone ===');
  console.log('phone input:', phone);
  
  if (!phone) {
    throw new Error('Telefone é obrigatório');
  }

  // Remove tudo que não é número
  const normalized = phone.replace(/\D/g, '');
  
  console.log('normalized:', normalized);
  console.log('normalized.length:', normalized.length);

  // Validar se tem entre 10 e 11 dígitos (Brasil)
  if (normalized.length < 10 || normalized.length > 11) {
    console.log('ERRO: Comprimento inválido');
    throw new Error('Telefone inválido');
  }

  console.log('normalizePhone SUCCESS:', normalized);
  return normalized;
}