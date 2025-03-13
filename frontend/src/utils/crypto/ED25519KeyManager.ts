import {arrayBufferToBase64, base64ToArrayBuffer} from "@/utils/crypto/helpers.ts";
import {ed25519} from '@noble/curves/ed25519';

type dataType = Uint8Array | string

class KeyManager {
  protected key: Uint8Array

  constructor(key: dataType) {
    this.key = (typeof key === 'string') ? this.importKey(key) : key
  }

  importKey(key: string) {
    return base64ToArrayBuffer(key)
  }

  exportKey() {
    return arrayBufferToBase64(this.key)
  }
}

export class ED25519PublicKeyManager extends KeyManager {
  constructor(key: dataType) {
    super(key);
  }

  verify(sig: dataType, msg: dataType) {
    return ed25519.verify(
      (typeof sig === "string") ? base64ToArrayBuffer(sig) : sig,
      (typeof msg === "string") ? new TextEncoder().encode(msg) : msg,
      this.key)
  }
}

export class ED25519PrivateKeyManager extends KeyManager {
  constructor(key: dataType) {
    super(key);
  }

  sign(msg: dataType) {
    return ed25519.sign((typeof msg === "string") ? new TextEncoder().encode(msg) : msg, this.key)
  }
}

export class ED25519KeyPairManager {
  private publicKey: ED25519PublicKeyManager
  private privateKey: ED25519PrivateKeyManager

  constructor(edKeyPair?: string) {
    const {publicKey, privateKey} = edKeyPair ? JSON.parse(edKeyPair) : this.generateKeyPair()
    this.publicKey = new ED25519PublicKeyManager(publicKey)
    this.privateKey = new ED25519PrivateKeyManager(privateKey)
  }

  generateKeyPair() {
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = ed25519.getPublicKey(privateKey);
    return {privateKey, publicKey};
  }

  exportKeyPair() {
    return JSON.stringify({publicKey: this.publicKey.exportKey(), privateKey: this.privateKey.exportKey()});
  }

  getPublicKey() {
    return this.publicKey.exportKey();
  }

  getSmallPeerId() {
    return this.getPublicKey().slice(0, 8)
  }

  sign(msg: dataType) {
    return this.privateKey.sign(msg)
  }
}
