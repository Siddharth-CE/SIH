import React, { useState, useEffect } from 'react';
import {
  Heart,
  Plus,
  Star,
  Users,
  MapPin,
  Sparkles,
  Volume2,
  Trash2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { memoryService, voiceService } from '../../services';
import type { FamilyMemory } from '../../types';

export const MemoryBoard: React.FC = () => {
  const { activePatient } = useAuth();
  const { t } = useLanguage();
  const { playChime } = useAccessibility();

  const [memories, setMemories] = useState<FamilyMemory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New memory form
  const [newTitle, setNewTitle] = useState('');
  const [newRelationship, setNewRelationship] = useState('');
  const [newCategory, setNewCategory] = useState<FamilyMemory['category']>('people');
  const [newDescription, setNewDescription] = useState('');

  const loadMemories = async () => {
    if (activePatient?.id) {
      const list = await memoryService.getMemories(activePatient.id);
      setMemories(list);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [activePatient?.id]);

  const handleToggleFavorite = async (id: string) => {
    playChime('click');
    const updated = await memoryService.toggleFavorite(id);
    setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const handleDelete = async (id: string) => {
    playChime('click');
    await memoryService.deleteMemory(id);
    setMemories((prev) => prev.filter((r) => r.id !== id));
  };

  const handlePlayVoice = (memory: FamilyMemory) => {
    playChime('click');
    const textToSpeak = `${memory.title}. ${memory.description}`;
    voiceService.speak(textToSpeak, 'en-IN');
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !newTitle.trim()) return;

    playChime('success');
    const created = await memoryService.createMemory({
      patientId: activePatient.id,
      title: newTitle,
      relationshipOrPlace: newRelationship || 'Precious Memory',
      category: newCategory,
      description: newDescription,
      tags: ['Personal', 'Family'],
      favorite: false,
    });

    setMemories((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewRelationship('');
    setNewDescription('');
  };

  const filteredMemories = memories.filter((m) => {
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
            {t('memories.title')} 🖼️
          </h1>
          <p className="text-stone-600 text-lg">{t('memories.subtitle')}</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>{t('memories.addMemory')}</span>
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: 'all', label: 'All Memories' },
          { id: 'people', label: t('memories.myPeople'), icon: Users },
          { id: 'places', label: t('memories.myPlaces'), icon: MapPin },
          { id: 'favorites', label: t('memories.favoriteThings'), icon: Heart },
          { id: 'today', label: t('memories.todayMemory'), icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playChime('click');
              setSelectedCategory(tab.id);
            }}
            className={`px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {filteredMemories.map((mem) => (
          <Card
            key={mem.id}
            variant="warm"
            className="p-6 border-2 border-[#E2D8C3] hover:border-[#0F4C3A] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C3A] bg-[#E7F3ED] px-3 py-1 rounded-full border border-[#BDE0D0]">
                  {mem.category} • {mem.relationshipOrPlace}
                </span>
                <button
                  onClick={() => handleToggleFavorite(mem.id)}
                  className="text-stone-400 hover:text-amber-500 transition-colors cursor-pointer p-1"
                  aria-label="Star favorite memory"
                >
                  <Star
                    className={`w-6 h-6 ${
                      mem.favorite ? 'text-amber-500 fill-amber-500' : ''
                    }`}
                  />
                </button>
              </div>

              <h3 className="text-2xl font-black text-stone-900 mb-2">
                {mem.title}
              </h3>
              <p className="text-stone-700 text-base leading-relaxed mb-4">
                "{mem.description}"
              </p>

              {mem.dateOrEra && (
                <div className="text-xs font-semibold text-stone-500 mb-4">
                  Era / Date: {mem.dateOrEra}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200/80">
              <button
                onClick={() => handlePlayVoice(mem)}
                className="flex items-center gap-1.5 text-xs font-extrabold text-[#0F4C3A] bg-white hover:bg-emerald-50 px-3.5 py-2 rounded-xl border border-stone-300 transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#0F4C3A]" />
                <span>{t('memories.voiceStory')}</span>
              </button>

              <button
                onClick={() => handleDelete(mem.id)}
                className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                title="Delete memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Memory Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Family Memory"
        subtitle="Capture a cherished story, family face, or familiar Northeast place."
      >
        <form onSubmit={handleCreateMemory} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Memory Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grandson Rohan visiting Jorhat"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-[#0F4C3A] outline-none font-semibold text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as FamilyMemory['category'])}
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-[#0F4C3A] outline-none font-semibold text-stone-900 bg-white"
              >
                <option value="people">My People</option>
                <option value="places">My Places</option>
                <option value="favorites">Favorite Things</option>
                <option value="today">Today's Joy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                Relation or Location
              </label>
              <input
                type="text"
                value={newRelationship}
                onChange={(e) => setNewRelationship(e.target.value)}
                placeholder="e.g. Grandson / Shillong Pines"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-[#0F4C3A] outline-none font-semibold text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Story / Memory Note *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Write a heartwarming memory sentence..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-[#0F4C3A] outline-none font-semibold text-stone-900"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Memory
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
