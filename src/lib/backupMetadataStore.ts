import db, { Backup, BackupsDB, Repo, Blob, PrefsDoc } from "./db"

interface EncryptableOptions {
  encryptedWith?: string
}

type RepoOptions = EncryptableOptions
type PrefsDocOptions = EncryptableOptions

type BlobOptions = EncryptableOptions & {
  contentType?: string
}

export interface BackupMetadataStore {
  addRepo: (cid: string, uploadCid: string, backupId: number, accountDid: string, commit: string, opts?: RepoOptions) => Promise<void>
  addPrefsDoc: (cid: string, backupId: number, accountDid: string, opts?: PrefsDocOptions) => Promise<void>
  addBlob: (cid: string, backupId: number, accountDid: string, opts?: BlobOptions) => Promise<void>
  addBackup: (accountDid: string) => Promise<number>
  listBackups: () => Promise<Backup[]>
  getRepo: (backupId: number) => Promise<Repo | undefined>
  listBlobs: (backupId: number) => Promise<Blob[]>
  getPrefsDoc: (backupId: number) => Promise<PrefsDoc | undefined>
}

type BackupMetadataStoreInitializer = (db: BackupsDB) => BackupMetadataStore

export const newBackupMetadataStore: BackupMetadataStoreInitializer = (db) => ({
  async addRepo (cid, uploadCid, backupId, accountDid, commit, { encryptedWith } = {}) {
    await db.repos.put({ cid, uploadCid, backupId, accountDid, commit, createdAt: new Date(), encryptedWith })
  },
  async addPrefsDoc (cid, backupId, accountDid, { encryptedWith } = {}) {
    await db.prefsDocs.put({ cid, backupId, accountDid, createdAt: new Date(), encryptedWith })
  },
  async addBlob (cid, backupId, accountDid, { contentType, encryptedWith } = {}) {
    await db.blobs.put({ cid, contentType, backupId, accountDid, createdAt: new Date(), encryptedWith })
  },
  async addBackup (accountDid) {
    return await db.backups.add({ accountDid, createdAt: new Date() })
  },
  async listBackups () {
    return db.backups.toArray()
  },
  async getRepo (backupId) {
    return db.repos.where('backupId').equals(backupId).first()
  },
  async listBlobs (backupId) {
    return db.blobs.where('backupId').equals(backupId).toArray()
  },
  async getPrefsDoc (backupId) {
    return db.prefsDocs.where('backupId').equals(backupId).first()
  }
})

export const backupMetadataStore: BackupMetadataStore = newBackupMetadataStore(db)