import React from 'react';

import './button.css';
import { useBskyAuthContext } from '@/contexts';
import { Loader } from '@/components/Loader';
import StorachaAuthenticator from '@/components/StorachaAuthenticator';
import BlueskyAuthenticator from '@/components/BlueskyAuthenticator';
import { useW3 } from '@w3ui/react';
import BackupUI from '@/components/BackupUI';
import { useBackupsContext } from '@/contexts/backups';
import { useLiveQuery } from 'dexie-react-hooks';
import { Backups } from '@/components/Backups';

export const Dashboard = () => {
  const bluesky = useBskyAuthContext()
  const [storacha] = useW3()
  const { backupsStore } = useBackupsContext()
  const backups = useLiveQuery(() => backupsStore.listBackups())
  return (
    <div className="flex flex-col space-y-4">
      <div>
        {bluesky.initialized ? (
          bluesky.authenticated ? (
            storacha.accounts?.[0] ? (
              <BackupUI />
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
      <div>
        <h2 className="text-sm font-mono font-bold uppercase mb-2">Backups</h2>
        {backups ? (backups.length > 0 ? (
          <Backups />
        ) : (
          <span>You have not yet created any backups.</span>
        )) : (
          <Loader />
        )}
      </div>
    </div>
  )
};
