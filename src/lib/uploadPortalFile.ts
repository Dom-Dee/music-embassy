import { supabase } from './supabase'

const BUCKET = 'portal-files'

const MAX_FILE_BYTES = 25 * 1024 * 1024

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\-()+\s]/g, '_').replace(/\s+/g, '-')
}

export type UploadFolder =
  | 'lessons'
  | 'assignments'
  | 'assignment-submissions'
  | 'events'
  | 'gallery'
  | 'instruments'

const FOLDER_MAX_BYTES: Partial<Record<UploadFolder, number>> = {
  events: 100 * 1024 * 1024,
  gallery: 100 * 1024 * 1024,
  instruments: 10 * 1024 * 1024,
}

export async function uploadPortalFiles(
  files: File[],
  folder: UploadFolder,
  studentId?: string,
): Promise<string[]> {
  if (files.length === 0) return []

  if (folder === 'assignment-submissions' && !studentId) {
    throw new Error('Student id is required for assignment submissions.')
  }

  const urls: string[] = []

  for (const file of files) {
    const maxBytes = FOLDER_MAX_BYTES[folder] ?? MAX_FILE_BYTES
    const maxLabel = maxBytes >= 100 * 1024 * 1024 ? '100 MB' : '25 MB'
    if (file.size > maxBytes) {
      throw new Error(`"${file.name}" is too large. Maximum size is ${maxLabel}.`)
    }

    const path =
      folder === 'assignment-submissions'
        ? `assignment-submissions/${studentId}/${crypto.randomUUID()}/${sanitizeFileName(file.name)}`
        : `${folder}/${crypto.randomUUID()}/${sanitizeFileName(file.name)}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      throw new Error(
        error.message.includes('Bucket not found')
          ? 'File storage is not set up yet. Run supabase/RUN-IN-SUPABASE.sql in Supabase.'
          : `Could not upload "${file.name}": ${error.message}`,
      )
    }

    urls.push(path)
  }

  return urls
}

export function fileNameFromUrl(url: string): string {
  try {
    const segment = decodeURIComponent(new URL(url).pathname.split('/').pop() ?? 'File')
    return segment || 'Download file'
  } catch {
    return 'Download file'
  }
}
