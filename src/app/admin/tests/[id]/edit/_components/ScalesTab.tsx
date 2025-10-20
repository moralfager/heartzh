'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BarChart } from 'lucide-react';

interface Scale {
  id: string;
  key: string;
  name: string;
  min: number;
  max: number;
  bands?: any;
}

export function ScalesTab({ testId, onRefresh }: { testId: string; onRefresh?: () => void }) {
  const [scales, setScales] = useState<Scale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingScale, setEditingScale] = useState<Scale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadScales();
  }, [testId]);

  const loadScales = async () => {
    try {
      const res = await fetch(`/api/admin/tests/${testId}/scales`);
      const data = await res.json();
      setScales(data);
    } catch (error) {
      console.error('Error loading scales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить шкалу?')) return;
    
    try {
      await fetch(`/api/admin/tests/${testId}/scales/${id}`, { method: 'DELETE' });
      loadScales();
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  if (isLoading) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Шкалы результатов</h2>
          <p className="text-sm text-gray-500 mt-1">Всего: {scales.length}</p>
        </div>
        <button
          onClick={() => { setEditingScale(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Добавить шкалу
        </button>
      </div>

      <div className="divide-y">
        {scales.length === 0 ? (
          <div className="text-center py-12">
            <BarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Нет шкал</p>
            <p className="text-sm text-gray-500 mt-1">Добавьте первую шкалу</p>
          </div>
        ) : (
          scales.map(scale => (
            <div key={scale.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
              <div>
                <div className="font-medium">{scale.name}</div>
                <div className="text-sm text-gray-500">
                  Ключ: <code className="bg-gray-100 px-2 py-0.5 rounded">{scale.key}</code> | 
                  Диапазон: {scale.min}-{scale.max}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingScale(scale); setIsModalOpen(true); }}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <Edit2 className="h-5 w-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(scale.id)}
                  className="p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <ScaleEditor
          testId={testId}
          scale={editingScale}
          onClose={() => setIsModalOpen(false)}
          onSave={() => { loadScales(); setIsModalOpen(false); }}
        />
      )}
    </div>
  );
}

function ScaleEditor({ testId, scale, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    key: scale?.key || '',
    name: scale?.name || '',
    min: scale?.min || 0,
    max: scale?.max || 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = scale
        ? `/api/admin/tests/${testId}/scales/${scale.id}`
        : `/api/admin/tests/${testId}/scales`;
      
      const method = scale ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      onSave();
    } catch (error) {
      alert('Ошибка сохранения');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">
          {scale ? 'Редактировать шкалу' : 'Новая шкала'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ключ (ID)</label>
            <input
              type="text"
              value={formData.key}
              onChange={e => setFormData({...formData, key: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="O, C, secure_attachment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Открытость опыту"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min</label>
              <input
                type="number"
                value={formData.min}
                onChange={e => setFormData({...formData, min: Number(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max</label>
              <input
                type="number"
                value={formData.max}
                onChange={e => setFormData({...formData, max: Number(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-xl">
              Отмена
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-xl">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

