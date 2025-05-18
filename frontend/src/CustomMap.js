import React, { useEffect, useRef, useState } from 'react';
import './CustomMap.css';

const CustomMap = ({ coordinates, locationName }) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1); // Начальный уровень масштабирования
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Смещение для панорамирования
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false); // Для tooltip

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Очистка Canvas
    ctx.clearRect(0, 0, width, height);

    // Применяем масштабирование и смещение
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Фон карты (светло-зелёный для "земли")
    ctx.fillStyle = '#E8F5E9';
    ctx.fillRect(-offset.x / zoom, -offset.y / zoom, width / zoom, height / zoom);

    // Рисуем реку
    ctx.fillStyle = '#B3E5FC'; // Голубой цвет для воды
    ctx.beginPath();
    ctx.moveTo(-offset.x / zoom, (height * 0.7) / zoom);
    ctx.quadraticCurveTo((width * 0.3) / zoom, (height * 0.5) / zoom, (width * 0.5) / zoom, (height * 0.7) / zoom);
    ctx.quadraticCurveTo((width * 0.7) / zoom, (height * 0.9) / zoom, (width / zoom) - offset.x / zoom, (height * 0.7) / zoom);
    ctx.lineTo((width / zoom) - offset.x / zoom, (height / zoom) - offset.y / zoom);
    ctx.lineTo(-offset.x / zoom, (height / zoom) - offset.y / zoom);
    ctx.closePath();
    ctx.fill();

    // Рисуем парк (зелёная зона)
    ctx.fillStyle = '#C8E6C9'; // Светло-зелёный для парка
    ctx.beginPath();
    ctx.arc((width * 0.2) / zoom, (height * 0.2) / zoom, 50 / zoom, 0, 2 * Math.PI);
    ctx.fill();

    // Рисуем дороги
    ctx.strokeStyle = '#B0BEC5'; // Серый цвет для дорог
    ctx.lineWidth = 10 / zoom;
    // Горизонтальная дорога
    ctx.beginPath();
    ctx.moveTo(-offset.x / zoom, (height * 0.3) / zoom);
    ctx.lineTo((width / zoom) - offset.x / zoom, (height * 0.3) / zoom);
    ctx.stroke();
    // Вертикальная дорога
    ctx.beginPath();
    ctx.moveTo((width * 0.4) / zoom, -offset.y / zoom);
    ctx.lineTo((width * 0.4) / zoom, (height / zoom) - offset.y / zoom);
    ctx.stroke();
    // Диагональная дорога
    ctx.beginPath();
    ctx.moveTo((width * 0.6) / zoom, -offset.y / zoom);
    ctx.lineTo((width * 0.8) / zoom, (height / zoom) - offset.y / zoom);
    ctx.stroke();

    // Рисуем здания
    ctx.fillStyle = '#CFD8DC'; // Светло-серый цвет для зданий
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() * width) / zoom;
      const y = (Math.random() * height) / zoom;
      const buildingWidth = (15 + Math.random() * 25) / zoom;
      const buildingHeight = (15 + Math.random() * 25) / zoom;
      // Избегаем рисования зданий на воде, дорогах и парке
      if (
        y > (height * 0.7) / zoom || // Не рисуем на воде
        (y > (height * 0.25) / zoom && y < (height * 0.35) / zoom) || // Не рисуем на горизонтальной дороге
        (x > (width * 0.35) / zoom && x < (width * 0.45) / zoom) || // Не рисуем на вертикальной дороге
        (Math.sqrt((x - (width * 0.2) / zoom) ** 2 + (y - (height * 0.2) / zoom) ** 2) < 50 / zoom) // Не рисуем в парке
      ) {
        continue;
      }
      ctx.fillRect(x, y, buildingWidth, buildingHeight);
      // Добавляем "окна"
      ctx.fillStyle = '#B0BEC5';
      ctx.fillRect(x + 5 / zoom, y + 5 / zoom, 5 / zoom, 5 / zoom);
      ctx.fillRect(x + 15 / zoom, y + 5 / zoom, 5 / zoom, 5 / zoom);
    }

    // Нормализуем координаты (lat, lng) в пиксели Canvas
    const normalizedX = ((coordinates.lng + 180) / 360) * (width / zoom);
    const normalizedY = ((90 - coordinates.lat) / 180) * (height / zoom);

    // Отрисовка маркера
    ctx.fillStyle = '#6B2D5C';
    ctx.beginPath();
    ctx.arc(normalizedX, normalizedY, 12 / zoom, 0, 2 * Math.PI);
    ctx.fill();

    // Тень для маркера
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(normalizedX + 5 / zoom, normalizedY + 5 / zoom, 12 / zoom, 0, 2 * Math.PI);
    ctx.fill();

    // Текст с названием местоположения (отображается при наведении)
    if (hovered) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(normalizedX - 50 / zoom, normalizedY - 40 / zoom, 100 / zoom, 30 / zoom);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${14 / zoom}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(locationName || 'Unknown Location', normalizedX, normalizedY - 20 / zoom);
    }

    ctx.restore();
  }, [coordinates, locationName, zoom, offset, hovered]);

  // Обработчики масштабирования
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3)); // Максимальный зум 3x
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5)); // Минимальный зум 0.5x
  };

  // Обработчики панорамирования
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - offset.x,
      y: e.clientY - rect.top - offset.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) {
      // Проверяем, наведён ли курсор на маркер
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - offset.x) / zoom;
      const mouseY = (e.clientY - rect.top - offset.y) / zoom;
      const normalizedX = ((coordinates.lng + 180) / 360) * (canvasRef.current.width / zoom);
      const normalizedY = ((90 - coordinates.lat) / 180) * (canvasRef.current.height / zoom);
      const distance = Math.sqrt((mouseX - normalizedX) ** 2 + (mouseY - normalizedY) ** 2);
      setHovered(distance < 12 / zoom);
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setOffset({
      x: x - dragStart.x,
      y: y - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="custom-map-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>−</button>
      </div>
    </div>
  );
};

export default CustomMap;