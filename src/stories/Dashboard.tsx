import React from 'react';

import './button.css';
import { useBskyAuthContext } from '@/contexts';
import { Loader } from '@/components/Loader';
import StorachaAuthenticator from '@/components/StorachaAuthenticator';
import BlueskyAuthenticator from '@/components/BlueskyAuthenticator';
import BackupButton from '@/components/BackupButton';
import { BackupMetadataStore } from '@/lib/bluesky';
import { backupMetadataStore } from '@/lib/backupMetadataStore';
import { useW3 } from '@w3ui/react';

export interface DashboardProps {
  backups?: BackupMetadataStore;
}

export const Dashboard = ({
  backups
}: DashboardProps) => {
  const bluesky = useBskyAuthContext()
  const [storacha] = useW3()
  return (
    <div>
      {bluesky.initialized ? (
        bluesky.authenticated ? (
          storacha.accounts?.[0] ? (
            <BackupButton
              backupMetadataStore={backups || backupMetadataStore} />
          ) : (
            <StorachaAuthenticator />
          )
        ) : (
          <BlueskyAuthenticator />
        )
      ) : (
        <Loader />
      )}
    </div>
  )
};
