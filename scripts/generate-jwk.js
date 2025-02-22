import { generateKeyPair } from 'jose';

async function generateJWK() {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  
  const publicJWK = await publicKey.export({ format: 'jwk' });
  const privateJWK = await privateKey.export({ format: 'jwk' });

  console.log('Public JWK:', JSON.stringify(publicJWK, null, 2));
  console.log('Private JWK:', JSON.stringify(privateJWK));
}

generateJWK();
