import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

interface props {
    onFileUploaded: (file: File) => void
}

const ImageUpload: React.FC<props> = ({ onFileUploaded }) => {
    const [selectedFileUrl, setSelectedFileUrl] = useState('')

    const onDrop = useCallback(acceptedFiles => {
        const [file] = acceptedFiles

        const fileUrl = URL.createObjectURL(file)

        setSelectedFileUrl(fileUrl)
        onFileUploaded(file)
        
    }, [onFileUploaded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    const classes = [
        'imageUpload',
        isDragActive ? 'dragging' : '',
        selectedFileUrl ? 'hasPreview' : ''
    ]

    return (
        <div {...getRootProps()} className={classes.join(' ')}>
            <input {...getInputProps()} accept="image/*" />
            <div className="overlay">
                <FiUpload size={24} color="#34CB79" />
            </div>
            {selectedFileUrl ? <img src={selectedFileUrl} alt="preview" className="preview"/> : <p>Imagem do estabelecimento</p>}
        </div>
    )
}

export default ImageUpload