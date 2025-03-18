'use client'

import { useBackupsContext } from "@/contexts/backups"
import { GATEWAY_HOST } from "@/lib/constants"
import { shortenCID, shortenDID } from "@/lib/ui"
import { useLiveQuery } from "dexie-react-hooks"
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "./Table"

export function Backups ({ className = '' }: { className?: string }) {
  const { backupsStore } = useBackupsContext()
  const backups = useLiveQuery(() => backupsStore.listBackups())

  return (
    <div className={className}>
      <div className='p-2 bg-white/50 rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Backup</TableHeaderCell>
              <TableHeaderCell>Account DID</TableHeaderCell>
              <TableHeaderCell>Created At</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups?.map((backup) => (
              <TableRow key={backup.id}>
                <TableCell>
                  <a href={`/backups/${backup.id}`} className="text-[var(--color-bluesky-blue)] hover:underline">
                    {backup.id}
                  </a>
                </TableCell>
                <TableCell>
                  <a href={`/backups/${backup.id}`} className="font-mono text-sm">
                    {shortenDID(backup.accountDid)}
                  </a>
                </TableCell>
                <TableCell>
                  <a href={`/backups/${backup.id}`}>
                    {backup.createdAt.toDateString()}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function Repo ({ backupId, className = '' }: { backupId: number, className?: string }) {
  const { backupsStore } = useBackupsContext()
  const repo = useLiveQuery(() => backupsStore.getRepo(backupId))
  return (
    <div className={className}>
      <h2 className="text-sm font-mono font-bold uppercase mb-2">Repos</h2>
      <div className='p-2 bg-white/50 rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Upload CID</TableHeaderCell>
              <TableHeaderCell>Repo CID</TableHeaderCell>
              <TableHeaderCell>Bluesky Account DID</TableHeaderCell>
              <TableHeaderCell>Commit</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repo && (
              <TableRow>
                <TableCell>
                  <a href={`${GATEWAY_HOST}/ipfs/${repo.uploadCid}`} className="font-mono text-sm">
                    {shortenCID(repo.uploadCid)}
                  </a>
                </TableCell>
                <TableCell>
                  <a href={`${GATEWAY_HOST}/ipfs/${repo.cid}`} className="font-mono text-sm">
                    {shortenCID(repo.cid)}
                  </a>
                </TableCell>
                <TableCell className="font-mono text-sm">{shortenDID(repo.accountDid)}</TableCell>
                <TableCell>{repo.commit}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function Prefs ({ backupId, className = '' }: { backupId: number, className?: string }) {
  const { backupsStore } = useBackupsContext()
  const prefsDoc = useLiveQuery(() => backupsStore.getPrefsDoc(backupId))
  return (
    <div className={className}>
      <h2 className="text-sm font-mono font-bold uppercase mb-2">Preferences</h2>
      <div className='p-2 bg-white/50 rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>CID</TableHeaderCell>
              <TableHeaderCell>Bluesky Account DID</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prefsDoc && (
              <TableRow key={prefsDoc.cid}>
                <TableCell>
                  <a href={`${GATEWAY_HOST}/ipfs/${prefsDoc.cid}`} className="font-mono text-sm">
                    {shortenCID(prefsDoc.cid)}
                  </a>
                </TableCell>
                <TableCell className="font-mono text-sm">{shortenDID(prefsDoc.accountDid)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function Blobs ({ backupId, className = '' }: { backupId: number, className?: string }) {
  const { backupsStore } = useBackupsContext()
  const blobs = useLiveQuery(() => backupsStore.listBlobs(backupId))
  return (
    <div className={className}>
      <h2 className="text-sm font-mono font-bold uppercase mb-2">Blobs</h2>
      <div className='p-2 bg-white/50 rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>CID</TableHeaderCell>
              <TableHeaderCell>Bluesky Account DID</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blobs?.map(blob => (
              <TableRow key={blob.cid}>
                <TableCell>
                  <a href={`${GATEWAY_HOST}/ipfs/${blob.cid}`} className="font-mono text-sm">
                    {shortenCID(blob.cid)}
                  </a>
                </TableCell>
                <TableCell className="font-mono text-sm">{shortenDID(blob.accountDid)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}