import type { Meta, StoryObj } from '@storybook/react';

import { KeychainView } from '@/components/Keychain';
import { fn } from '@storybook/test';

const key = {
  id: 'did:key:publiconlykeypair',
  symkeyCid: 'bafybeigreable'
}

const keyPair = {
  publicKey: {} as CryptoKey,
  PrivateKey: {} as CryptoKey,
  did: () => key.id,
  toSecret: async () => "secret secret, I've got a secret!"
}

const publicOnlyKey = {
  id: 'did:key:publiconlykeypair',
  symkeyCid: 'bafybeigreable'
}

const publicOnlyKeyPair = {
  publicKey: {} as CryptoKey,
  did: () => publicOnlyKey.id,
}

const keyPairs = {
  [publicOnlyKeyPair.did()]: publicOnlyKeyPair,
  [keyPair.did()]: keyPair
}

const meta = {
  title: 'components/KeychainView',
  component: KeychainView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    keys: [],
    keyPairs,
    generateKeyPair: async () => publicOnlyKey,
    setSelectedKey: fn(),
    importKey: fn(),
    forgetKey: fn()
  },
  decorators: [
  ]
} satisfies Meta<typeof KeychainView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};

export const WithKeys: Story = {
  args: {
    keys: [publicOnlyKey, key],
    keyPairs
  }
};
