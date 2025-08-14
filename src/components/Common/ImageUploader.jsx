// src/components/Common/ImageUploader.jsx
import React, { useState } from 'react';
import api from '../../services/api';

const ImageUploader = ({ onUpload, multiple = true, maxFiles = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    if (files.length > maxFiles) {
      alert(`Максимальное количество файлов: ${maxFiles}`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post('/api/media/multiple-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newFiles = response.data.files;
      setUploadedFiles(prev => [...prev, ...newFiles]);
      onUpload?.(newFiles);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке файлов');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.media_id !== fileId));
  };

  return (
    <div>
      <div>
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && <span>Загрузка...</span>}
      </div>

      {uploadedFiles.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {uploadedFiles.map((file) => (
            <div key={file.media_id} style={{ position: 'relative' }}>
              <img 
                src={file.thumbnail_url || file.file_url} 
                alt="Uploaded" 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <button
                onClick={() => removeFile(file.media_id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
