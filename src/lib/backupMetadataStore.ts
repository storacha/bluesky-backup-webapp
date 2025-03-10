import { BackupMetadataStore } from "@/lib/bluesky"
import db from "./db"

export const backupMetadataStore: BackupMetadataStore = {
  async setLatestCommit (accountDid, commitRev) {
    await db.commits.put({ accountDid, commitRev })
  },
  async addRepo (cid, uploadCid, backupId, accountDid) {
    await db.repos.put({ cid, uploadCid, backupId, accountDid })
  },
  async addBlob (cid, backupId, accountDid) {
    await db.blobs.put({ cid, backupId, accountDid })
  },
  async addBackup (accountDid) {
    return await db.backups.add({ accountDid, createdAt: new Date() })
  },
  async listBackups () {
    return db.backups.toArray()
  }
}