import React, { useState } from 'react';
import api from '../../services/api';

const ImageUploader = ({ onUpload, multiple = true, maxFiles = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (files) => {
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

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileChange(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    handleFileChange(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.media_id !== fileId));
  };

  return (
    <div className="bg-black border-4 border-orange-500 p-6 relative">
      {/* Заголовок */}
      <div className="mb-6">
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-2">
          <span className="text-orange-500">ЗАГРУЗКА</span> ФОТО
        </h3>
        <div className="w-full h-1 bg-orange-500"></div>
        <p className="text-gray-300 font-bold text-sm mt-2 uppercase">
          МАКСИМУМ {maxFiles} ФАЙЛОВ
        </p>
      </div>

      {/* Область загрузки */}
      <div
        className={`relative border-4 border-dashed transition-all duration-300 p-8 text-center cursor-pointer
          ${dragOver 
            ? 'border-orange-500 bg-orange-900/20' 
            : uploading 
              ? 'border-gray-600 bg-gray-900' 
              : 'border-white hover:border-orange-500 hover:bg-gray-900'
          }
          ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && document.getElementById('file-input').click()}
      >
        {/* Скрытый input */}
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading}
          className="hidden"
        />

        {/* Содержимое области загрузки */}
        {uploading ? (
          <div className="flex flex-col items-center">
            {/* Анимация загрузки */}
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h4 className="text-white font-black text-xl uppercase tracking-wider mb-2">
              ЗАГРУЗКА...
            </h4>
            <p className="text-orange-500 font-bold">
              ОБРАБОТКА ФАЙЛОВ
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Иконка загрузки */}
            <div className="w-20 h-20 border-4 border-current text-white mb-6 flex items-center justify-center">
              <div className="text-4xl font-black">+</div>
            </div>
            
            <h4 className="text-white font-black text-xl md:text-2xl uppercase tracking-wider mb-4">
              {dragOver ? 'ОТПУСТИТЕ ФАЙЛЫ' : 'ДОБАВИТЬ ФОТО'}
            </h4>
            
            <div className="space-y-2 text-center">
              <p className="text-orange-500 font-bold text-lg uppercase">
                ПЕРЕТАЩИТЕ СЮДА
              </p>
              <p className="text-gray-300 font-bold text-sm uppercase">
                ИЛИ НАЖМИТЕ ДЛЯ ВЫБОРА
              </p>
              <p className="text-gray-400 text-xs">
                ПОДДЕРЖИВАЮТСЯ: JPG, PNG, GIF
              </p>
            </div>
          </div>
        )}

        {/* Декоративные элементы */}
        <div className="absolute top-2 left-2 w-4 h-4 border-2 border-current opacity-50"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-2 border-current opacity-50"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-2 border-current opacity-50"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-current opacity-50"></div>
      </div>

      {/* Превью загруженных файлов */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-black text-lg uppercase tracking-wider">
              <span className="text-orange-500">●</span> ЗАГРУЖЕННЫЕ ФОТО ({uploadedFiles.length})
            </h4>
            <div className="text-gray-400 text-sm font-bold">
              {uploadedFiles.length} / {maxFiles}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {uploadedFiles.map((file, index) => (
              <div 
                key={file.media_id} 
                className="group relative bg-gray-900 border-2 border-orange-500 overflow-hidden aspect-square"
              >
                {/* Изображение */}
                <img 
                  src={file.thumbnail_url || file.file_url} 
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Оверлей при наведении */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.media_id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                             bg-red-600 hover:bg-red-500 text-white font-black w-10 h-10 
                             border-2 border-white flex items-center justify-center text-xl
                             transform hover:scale-110 transition-transform"
                  >
                    ×
                  </button>
                </div>

                {/* Номер изображения */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-orange-500 font-black text-xs px-2 py-1 border border-orange-500">
                  #{index + 1}
                </div>

                {/* Индикатор основного фото */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-orange-500 text-black font-black text-xs px-2 py-1 uppercase">
                    ГЛАВНОЕ
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Инфо блок */}
          <div className="mt-4 p-4 bg-gray-900 border-2 border-orange-500">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-500 font-black">💡</span>
              <span className="text-white font-bold">
                ПЕРВОЕ ФОТО БУДЕТ ИСПОЛЬЗОВАНО КАК ГЛАВНОЕ
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Главные декоративные элементы */}
      <div className="absolute top-2 left-2 w-6 h-6 border-2 border-orange-500"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-orange-500"></div>
    </div>
  );
};

export default ImageUploader;