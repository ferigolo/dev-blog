"use client";

import { useCallback } from 'react'
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone'
import { UploadCloud, File as FileIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  accept?: DropzoneOptions['accept']
  className?: string
  multiple?: boolean
}

export function FileUpload({
  onFilesSelected,
  disabled,
  accept,
  className,
  multiple = true,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Passa os arquivos aceitos para o pai
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles)
      }

      if (rejectedFiles.length > 0) {
        alert("Alguns arquivos foram rejeitados (tipo inválido ou muito grandes).")
      }
    },
    [onFilesSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    disabled,
    multiple
  })

  return (
      <div
        {...getRootProps()}
        className={cn(
          "relative w-full cursor-pointer flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200 ease-in-out hover:bg-muted/50",
          isDragActive
            ? "border-primary bg-primary/10 animate-pulse"
            : "border-muted-foreground/25 hover:border-primary",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="p-3 rounded-full bg-background border shadow-sm">
            <UploadCloud className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive ? "Solte os arquivos agora" : "Arraste arquivos ou clique aqui"}
            </p>
            <p className="text-xs text-muted-foreground">
              {multiple ? "Você pode enviar vários arquivos de uma vez" : "Apenas um arquivo"}
            </p>
          </div>
        </div>
      </div>
  )
}