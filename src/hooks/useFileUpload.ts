// @ts-nocheck
import { useRef, useState } from 'react'
import { message } from 'antd'
import { formatBytes } from 'src/helpers/formatter.helper'

const useFileUpload = ({ onChange, maxSize }) => {
  const fileRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const onReset = () => {
    fileRef.current.value = ''
  }

  const onFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) {
      onReset()
      message.error({ content: 'Gagal mendapatkan file', duration: 6 })
      return
    }
    if (maxSize) {
      const fileSize = formatBytes(file.size)
      if (
        typeof fileSize === 'object' &&
        fileSize?.value > maxSize &&
        fileSize?.unitIndex >= maxSize
      ) {
        onReset()
        message.error({
          content: 'File size is too large. Try uploading smaller size',
          duration: 6,
        })
        return
      }
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const res = await new Promise<ProgressEvent<FileReader>>(
      (resolve, rejected) => {
        reader.onprogress = () => {
          setLoading(true)
        }
        reader.onloadend = (event: ProgressEvent<FileReader>) => {
          setLoading(false)
          resolve(event)
        }
        reader.onerror = rejected
      },
    )
    if (res instanceof ProgressEvent) {
      const event = res as ProgressEvent<FileReader>
      onChange({ file, url: event.target?.result as string })
    }
  }

  return { fileRef, loading, onFileChange, onReset }
}

export default useFileUpload
