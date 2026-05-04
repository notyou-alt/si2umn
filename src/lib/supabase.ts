import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase env belum diset')
}

// pastikan hanya dipakai server
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
})

const BUCKET_NAME = 'documents'

export async function uploadFile(file: File, folder?: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = folder ? `${folder}/${fileName}` : fileName

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const path = extractPathFromUrl(fileUrl)
  if (!path) return

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) throw new Error(`Delete failed: ${error.message}`)
}

function extractPathFromUrl(url: string): string | null {
  const regex = /\/storage\/v1\/object\/public\/documents\/(.+)$/
  const match = url.match(regex)
  return match ? match[1] : null
}