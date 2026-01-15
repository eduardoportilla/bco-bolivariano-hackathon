# Security Guidelines

Banking applications require strict security. Follow these rules without exception.

---

## Forbidden Actions

| Action | Why |
|--------|-----|
| Hardcode secrets | Exposed in source control |
| Store tokens in localStorage | XSS vulnerable |
| Use `eval()` or `Function()` | Code injection risk |
| Disable SSL validation | MITM attacks |
| Log sensitive data | Data leakage in logs |
| Use `dangerouslySetInnerHTML` | XSS without sanitization |
| Store passwords in state | Memory exposure |

---

## Token Storage

### Web
```typescript
// Use httpOnly cookies set by backend
// Never store tokens in localStorage/sessionStorage

// Access token: httpOnly cookie (backend sets)
// Refresh token: httpOnly cookie (backend sets)
```

### Mobile
```typescript
import { secureStorage } from '@/services/security/secureStorage';

// Use Keychain (iOS) / Keystore (Android)
await secureStorage.setItem('accessToken', token);

// NEVER use AsyncStorage for tokens
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('token', token); // SECURITY VIOLATION
```

---

## Input Sanitization

```typescript
import DOMPurify from 'dompurify';

// Sanitize any user input before rendering
const sanitized = DOMPurify.sanitize(userInput);

// Validate with Zod
const schema = z.object({
  email: z.string().email(),
  amount: z.number().positive().max(1000000),
});
```

---

## API Security

### Request Signing
```typescript
// Add CSRF token for mutations
if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
  config.headers['X-CSRF-Token'] = await getCSRFToken();
}
```

### Response Validation
```typescript
// Always validate API responses
const response = await apiClient.get('/accounts');
const validated = accountsSchema.parse(response.data);
return validated;
```

---

## Mobile Security

### Biometrics
```typescript
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();
const { success } = await rnBiometrics.simplePrompt({
  promptMessage: 'Confirmar identidad',
});
```

### Root/Jailbreak Detection
```typescript
import JailMonkey from 'jail-monkey';

if (JailMonkey.isJailBroken()) {
  // Block or warn user
  showSecurityAlert();
}
```

### Certificate Pinning
```typescript
// Verify SSL certificates match expected
const expectedCert = 'sha256/AAAA...';
// Configure in native networking layer
```

---

## Session Management

```typescript
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Inactivity timeout
let lastActivity = Date.now();

function trackActivity() {
  lastActivity = Date.now();
}

function checkSession() {
  if (Date.now() - lastActivity > SESSION_TIMEOUT) {
    logout();
    navigate('/login');
  }
}
```

---

## Logging Rules

```typescript
// ALLOWED: Non-sensitive info
logger.info('User logged in', { userId: user.id });
logger.error('Transfer failed', { errorCode: 'INSUFFICIENT_FUNDS' });

// FORBIDDEN: Sensitive data
logger.debug('Token:', accessToken);           // NEVER
logger.info('Password:', password);            // NEVER
logger.error('Card number:', cardNumber);      // NEVER
```

---

## OWASP Compliance

This project must comply with:
- OWASP Top 10 (Web)
- OWASP Mobile Top 10
- OWASP ASVS (Application Security Verification Standard)

Key areas:
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Security Misconfiguration
5. Vulnerable Components
