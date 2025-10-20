'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GitBranch, Upload, FileJson } from 'lucide-react';

interface Rule {
  id: string;
  kind: string;
  payload: any;
}

export function RulesTab({ testId, onRefresh }: { testId: string; onRefresh?: () => void }) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importJson, setImportJson] = useState("");

  useEffect(() => {
    loadRules();
  }, [testId]);

  const loadRules = async () => {
    try {
      const res = await fetch(`/api/admin/tests/${testId}/rules`);
      const data = await res.json();
      setRules(data);
    } catch (error) {
      console.error('Error loading rules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить правило?')) return;
    
    try {
      await fetch(`/api/admin/tests/${testId}/rules/${id}`, { method: 'DELETE' });
      loadRules();
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importJson);
      const res = await fetch(`/api/admin/tests/${testId}/import-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      if (res.ok) {
        alert('Импорт успешен!');
        setImportJson("");
        setIsImporting(false);
        loadRules();
        onRefresh?.();
      } else {
        const error = await res.json();
        alert(`Ошибка: ${error.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      alert('Неверный JSON формат');
    }
  };

  if (isLoading) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Правила расчёта</h2>
          <p className="text-sm text-gray-500 mt-1">Всего: {rules.length}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImporting(!isImporting)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2"
          >
            <Upload className="h-5 w-5" />
            Импорт JSON
          </button>
          <button
            onClick={() => { setEditingRule(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Добавить правило
          </button>
        </div>
      </div>

      {/* Import JSON Section */}
      {isImporting && (
        <div className="p-6 border-b bg-blue-50">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileJson className="h-5 w-5 text-blue-500" />
            Импорт Scales + Rules из JSON
          </h3>
          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-600">
              Вставьте JSON с массивами <code className="bg-white px-1 rounded">scales</code> и <code className="bg-white px-1 rounded">rules</code>.
            </p>
            <div className="bg-white rounded-lg p-3 text-xs text-gray-700 border border-blue-200">
              <p className="font-medium mb-1">💡 Быстрый старт с ИИ:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Откройте <strong>JSON-IMPORT-GUIDE.md</strong> в корне проекта</li>
                <li>Скопируйте промт для ChatGPT/Claude</li>
                <li>Опишите ваш тест → Получите JSON</li>
                <li>Вставьте сюда → Импортировать ✨</li>
              </ol>
            </div>
          </div>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder='{\n  "scales": [...],\n  "rules": [...]\n}'
          />
          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={() => setIsImporting(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
            >
              Отмена
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Импортировать
            </button>
          </div>
        </div>
      )}

      <div className="divide-y">
        {rules.length === 0 ? (
          <div className="text-center py-12">
            <GitBranch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Нет правил</p>
          </div>
        ) : (
          rules.map(rule => (
            <div key={rule.id} className="p-4 hover:bg-gray-50 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    rule.kind === 'threshold' ? 'bg-blue-100 text-blue-700' :
                    rule.kind === 'formula' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {rule.kind}
                  </span>
                </div>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-20">
                  {JSON.stringify(rule.payload, null, 2)}
                </pre>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => { setEditingRule(rule); setIsModalOpen(true); }}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <Edit2 className="h-5 w-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
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
        <RuleEditor
          testId={testId}
          rule={editingRule}
          onClose={() => setIsModalOpen(false)}
          onSave={() => { loadRules(); setIsModalOpen(false); }}
        />
      )}
    </div>
  );
}

function RuleEditor({ testId, rule, onClose, onSave }: any) {
  const [kind, setKind] = useState(rule?.kind || 'threshold');
  const [payload, setPayload] = useState(
    rule?.payload ? JSON.stringify(rule.payload, null, 2) : '{}'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedPayload = JSON.parse(payload);
      
      const url = rule
        ? `/api/admin/tests/${testId}/rules/${rule.id}`
        : `/api/admin/tests/${testId}/rules`;
      
      const method = rule ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, payload: parsedPayload }),
      });
      
      onSave();
    } catch (error) {
      alert('Ошибка JSON или сохранения');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
        <h3 className="text-xl font-semibold mb-4">
          {rule ? 'Редактировать правило' : 'Новое правило'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Тип</label>
            <select
              value={kind}
              onChange={e => setKind(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="threshold">Threshold (пороговые зоны)</option>
              <option value="formula">Formula (формулы)</option>
              <option value="combo">Combo (логика)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payload (JSON)</label>
            <textarea
              value={payload}
              onChange={e => setPayload(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
              rows={12}
              placeholder='{"scaleKey": "O", "ranges": [...]}'
            />
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

