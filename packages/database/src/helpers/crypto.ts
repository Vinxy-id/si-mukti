import { createHash, createHmac } from 'crypto';

export interface PassportHashInput {
  serialNumber: string;
  quarryBatchCode: string;
  labCertificateNo: string;
  workshopId: string;
}

/**
 * Menghasilkan SHA-256 Cryptographic Hash unik untuk Paspor Digital Marmer
 * Mengombinasikan Serial Number, Batch Kuari, Nomor Sertifikat SNI, dan ID Bengkel
 */
export function generatePassportHash(input: PassportHashInput): string {
  const payload = [
    input.serialNumber.trim(),
    input.quarryBatchCode.trim(),
    input.labCertificateNo.trim(),
    input.workshopId.trim(),
  ].join('::');

  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

/**
 * Menghasilkan tanda tangan digital anti-pemalsuan (HMAC-SHA256)
 * Menggunakan rahasia penjamin mutu (Pemkab / Disperindag Tulungagung)
 */
export function signPassportHash(passportHash: string, secretKey: string): string {
  const hmac = createHmac('sha256', secretKey);
  hmac.update(passportHash);
  const signature = hmac.digest('hex');
  return `${passportHash}.${signature}`;
}

/**
 * Memverifikasi validitas token paspor digital dari hasil pindai QR Code
 */
export function verifyPassportSignature(
  signedToken: string,
  secretKey: string
): { isValid: boolean; passportHash: string | null } {
  const parts = signedToken.split('.');
  if (parts.length !== 2) {
    return { isValid: false, passportHash: null };
  }

  const [passportHash, signature] = parts;
  const expectedSignature = createHmac('sha256', secretKey)
    .update(passportHash)
    .digest('hex');

  const isValid = signature === expectedSignature;
  return {
    isValid,
    passportHash: isValid ? passportHash : null,
  };
}

/**
 * Menghasilkan kode segel keaslian geologis terformat
 * Contoh: REG-PEMKAB-TA/2026/09841
 */
export function formatAuthenticitySeal(sequenceNumber: number, year: number = 2026): string {
  const padded = sequenceNumber.toString().padStart(5, '0');
  return `REG-PEMKAB-TA/${year}/${padded}`;
}
